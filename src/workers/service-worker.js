const basePath = self.location.pathname.replace(/\/service-worker\.js$/, '');

importScripts(`${basePath}/index.min.js`);
importScripts(`${basePath}/bundle.umd.js`);

// Cache keys
const CACHE_KEYS = {
  CONFIG: 'config-cache',
  TOKEN: 'token-cache',
  ENTRY: 'entry-file-cache',
  VIDEO: 'video-cache',
};

// Define cache expiration times in milliseconds
const EXPIRATION_TIMES = {
  [CACHE_KEYS.TOKEN]: 300000, // 5 minutes
  [CACHE_KEYS.ENTRY]: 300000, // 5 minutes
  [CACHE_KEYS.VIDEO]: 30 * 24 * 60 * 60 * 1000, // 1 month
};

const DECRYPTION_KEY_ERROR_MESSAGE =
  'The decryption key is invalid. Please check the key and try again.';
const DEFAULT_ERROR_MESSAGE =
  'An unexpected error occurred while playing the video.';

self.addEventListener('install', () => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.apiUrl) {
    console.log('Saving backend URL...');
    apiUrl = event.data.apiUrl;
    caches.open(CACHE_KEYS.CONFIG).then((cache) => {
      const response = new Response(apiUrl, {
        headers: { Date: new Date().toUTCString() },
      });
      cache.put('api-url', response);
    });
  }

  if (event.data && event.data.type === 'DELETE_EXPIRED_CACHE') {
    console.log('Cleaning expired caches...');
    event.waitUntil(deleteExpiredCacheEntries());
  }
});

async function deleteExpiredCacheEntries() {
  const currentTime = Date.now();

  for (const [cacheKey, expirationTime] of Object.entries(EXPIRATION_TIMES)) {
    const cache = await caches.open(cacheKey);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const cacheDate = new Date(dateHeader).getTime();
          if (currentTime - cacheDate > expirationTime) {
            await cache.delete(request);
          }
        }
      }
    }
  }
}

async function getApiUrl() {
  const cache = await caches.open(CACHE_KEYS.CONFIG);
  const response = await cache.match('api-url');
  if (response) {
    return await response.text();
  }
  return null;
}

self.addEventListener('fetch', function (event) {
  if (event.request.url.includes('non-existent-url/video.mp4')) {
    event.respondWith(handleVideo(event));
  } else {
    event.respondWith(fetch(event.request));
  }
});

async function handleVideo(event) {
  const { request } = event;
  const { slug, decryptionKey } = extractParams(request);
  const apiUrl = await getApiUrl();
  const range = event.request.headers.get('range');

  if (!slug) {
    return createErrorResponse('Requires slug.', 400);
  }

  if (!apiUrl) {
    return createErrorResponse('Requires backend url.', 400);
  }

  if (!range) {
    return createErrorResponse('Requires Range header.', 400);
  }

  try {
    const tokenResponse = await fetchTokenWithCache(apiUrl, slug);
    if (!tokenResponse || tokenResponse.error) {
      return createErrorResponse(tokenResponse?.error, 400);
    }

    const file = await fetchFileMetadataWithCache(
      apiUrl,
      slug,
      tokenResponse.jwt_ott
    );
    if (!file || file.error) {
      return createErrorResponse(file?.error, 400);
    }

    const isEncrypted = !!file.is_clientside_encrypted;
    const isOnStorageProvider = !!file.is_on_storage_provider;
    const fileSize = file.converted_size ?? file.size;

    if (isEncrypted && !decryptionKey) {
      return createErrorResponse(
        'Decryption key is required for encrypted files.',
        400
      );
    }
    const key = isEncrypted ? decryptionKey : undefined;

    const { gateway } = tokenResponse;

    const { start, end, chunkIndex, contentLength, fileEnd, fileStart, level } =
      calculateRange({
        range,
        fileSize,
        isOnStorageProvider,
        gateway,
      });

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': file.mime,
    };

    const filePath = `${slug}-${chunkIndex}.mp4`;

    if (!(await caches.match(filePath))) {
      const readable = isOnStorageProvider
        ? await downloadFromStorageProvider({
            file,
            gateway,
            chunkIndex,
            level,
            key,
          })
        : await downloadFromBackend({ file, key, tokenResponse, chunkIndex });

      if (readable?.failed || !readable) {
        return createErrorResponse(
          readable?.message ?? DEFAULT_ERROR_MESSAGE,
          400
        );
      }

      await caches.open(CACHE_KEYS.VIDEO).then((cache) => {
        const response = new Response(readable, {
          headers: { Date: new Date().toUTCString() },
        });
        return cache.put(filePath, response);
      });
    }

    const cache = await caches.open(CACHE_KEYS.VIDEO);
    const cachedResponse = await cache.match(filePath);
    const chunk = await cachedResponse
      .arrayBuffer()
      .then((buffer) => buffer.slice(fileStart, fileEnd + 1));

    return new Response(chunk, { status: 206, headers });
  } catch (error) {
    return createErrorResponse(DEFAULT_ERROR_MESSAGE, 500);
  }
}

async function isCacheValid(cachedResponse) {
  const cacheTime = cachedResponse.headers.get('date');
  if (cacheTime) {
    const cachedDate = new Date(cacheTime);
    const currentTime = Date.now();
    return (
      currentTime - cachedDate.getTime() < EXPIRATION_TIMES[CACHE_KEYS.TOKEN]
    );
  }
  return false;
}

async function fetchTokenWithCache(apiUrl, slug) {
  const cache = await caches.open(CACHE_KEYS.TOKEN);
  const cachedResponse = await cache.match(slug);

  if (cachedResponse) {
    if (await isCacheValid(cachedResponse)) {
      return await cachedResponse.json();
    } else {
      await cache.delete(slug);
    }
  }

  const response = await generateToken(apiUrl, slug);
  if (response && !response.error) {
    await cache.put(
      slug,
      new Response(JSON.stringify(response), {
        headers: { Date: new Date().toUTCString() },
      })
    );
  }
  return response;
}

async function fetchFileMetadataWithCache(apiUrl, slug, jwt_ott) {
  const cache = await caches.open(CACHE_KEYS.ENTRY);
  const cachedResponse = await cache.match(slug);

  if (cachedResponse) {
    if (await isCacheValid(cachedResponse)) {
      return await cachedResponse.json();
    } else {
      await cache.delete(slug);
    }
  }

  const response = await fetchFileMetadata(apiUrl, slug, jwt_ott);
  if (response && !response.error) {
    await cache.put(
      slug,
      new Response(JSON.stringify(response), {
        headers: { Date: new Date().toUTCString() },
      })
    );
  }
  return response;
}

async function generateToken(apiUrl, slug) {
  const response = await fetch(`${apiUrl}/download/generate/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ slug }]),
  });
  const data = await response.json();

  if (!response.ok) {
    return { error: data.errors || 'Failed to generate token.' };
  }
  return data;
}

async function fetchFileMetadata(apiUrl, slug, jwt_ott) {
  const response = await fetch(`${apiUrl}/files/file/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Download-OTT-JWT': jwt_ott,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return { error: data.errors || 'Failed to fetch video data.' };
  }
  return data.entry;
}

function extractParams(request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const slug = params.get('slug');
  const decryptionKey = params.get('key');

  return {
    slug,
    decryptionKey,
  };
}

async function createErrorResponse(message, statusCode) {
  const response = new Response(JSON.stringify({ error: message }), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  clients.forEach((client) => {
    client.postMessage({ type: 'VIDEO_ERROR', message });
  });

  return response;
}

async function downloadFromStorageProvider({
  file,
  gateway,
  chunkIndex,
  key,
  level,
}) {
  const cids = file.cid.nodes.map((node) => node.cid);
  const cid = cids[chunkIndex];

  return await self['client-gateway'].downloadFileFromSP({
    carReader: self.IpldCar.CarReader,
    url: `${file.storage_provider.url}/${cid}`,
    uploadChunkSize: gateway.upload_chunk_size,
    isEncrypted: file.is_clientside_encrypted,
    key,
    iv: file.entry_clientside_key?.iv,
    file,
    level,
  });
}

async function downloadFromBackend({ file, key, tokenResponse, chunkIndex }) {
  const fileSize = file.converted_size ?? file.size;
  const chunkSize = tokenResponse.gateway.upload_chunk_size;

  const { count } = self['client-gateway'].getCountChunk(fileSize, chunkSize);

  const startTime = Date.now();
  let totalProgress = { number: 0 };

  const downloadedChunk = await self['client-gateway'].downloadChunk({
    index: self['client-gateway'].correctIndex(chunkIndex + 1, String(count)),
    oneTimeToken: tokenResponse.user_tokens.token,
    endpoint: tokenResponse.gateway.url,
    file,
    jwtOneTimeToken: tokenResponse.jwt_ott,
    startTime,
    totalProgress,
  });

  let chunk = downloadedChunk;

  if (file.is_clientside_encrypted) {
    try {
      const bufferKey = self['client-gateway'].convertBase64ToArrayBuffer(key);
      chunk = await self['client-gateway'].decryptChunk({
        chunk: downloadedChunk,
        iv: file.entry_clientside_key?.iv,
        key: bufferKey,
      });
      if (chunk?.failed) {
        return { failed: true, message: DECRYPTION_KEY_ERROR_MESSAGE };
      }
    } catch (error) {
      if (
        error instanceof DOMException ||
        error?.message === 'AES key data must be 128 or 256 bits' ||
        error?.message ===
          "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
      ) {
        return { failed: true, message: DECRYPTION_KEY_ERROR_MESSAGE };
      }
    }
  }

  return chunk;
}

function calculateRange({ range, fileSize, isOnStorageProvider, gateway }) {
  const { interim_chunk_size, upload_chunk_size } = gateway;
  const chunkSizeByLevel = {
    interim: interim_chunk_size,
    upload: upload_chunk_size,
  };

  const rangeParts = range.replace(/bytes=/, '').split('-');
  const requestedStart = Number(rangeParts[0]);
  const requestedEnd = rangeParts[1] ? Number(rangeParts[1]) : fileSize;
  const requestedBytes = requestedEnd - requestedStart;
  const level = requestedBytes > upload_chunk_size ? 'interim' : 'upload';
  const chunkSize = isOnStorageProvider
    ? chunkSizeByLevel[level]
    : upload_chunk_size;

  const chunkIndex =
    requestedStart === 0 ? 0 : Math.floor(requestedStart / chunkSize);

  const start = requestedStart;
  const end = Math.min(
    start + chunkSize - 1,
    fileSize - 1,
    requestedEnd,
    chunkSize * (chunkIndex + 1) - 1
  );
  const contentLength = end - start + 1;

  const fileStart = Math.max(0, start % chunkSize);
  const fileEnd = Math.min(chunkSize, end % chunkSize);

  return { start, end, contentLength, chunkIndex, fileStart, fileEnd, level };
}
