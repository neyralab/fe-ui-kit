const basePath = self.location.pathname.replace(/\/service-worker\.js$/, '');

importScripts(`${basePath}/index.min.js`);
importScripts(`${basePath}/bundle.umd.js`);

// Cache keys
const CACHE_KEYS = {
  CONFIG: 'config-cache',
  TOKEN: 'token-cache',
  CIDS: 'cids-cache',
  ENTRY: 'entry-file-cache',
  VIDEO: 'video-cache',
  AUDIO: 'audio-cache',
};

// Define cache expiration times in milliseconds
const EXPIRATION_TIMES = {
  [CACHE_KEYS.TOKEN]: 300000, // 5 minutes
  [CACHE_KEYS.ENTRY]: 300000, // 5 minutes
  [CACHE_KEYS.CIDS]: 60 * 60 * 1000, // 1 hour
  [CACHE_KEYS.VIDEO]: 30 * 24 * 60 * 60 * 1000, // 1 month
  [CACHE_KEYS.AUDIO]: 30 * 24 * 60 * 60 * 1000, // 1 month
};

const DECRYPTION_KEY_ERROR_MESSAGE =
  'The decryption key is invalid. Please check the key and try again.';
const DEFAULT_ERROR_MESSAGE =
  'An unexpected error occurred while playing the media.';

const MEDIA_TYPES = {
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
};

const VIDEO_URL = 'non-existent-url/video.mp4';
const AUDIO_URL = 'non-existent-url/audio.mp3';

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

      cache
        .put('api-url', response)
        .then(() => {
          event.source.postMessage({ type: 'API_URL_SAVED' });
        })
        .catch((error) => {
          event.source.postMessage({
            type: 'API_URL_SAVE_FAILED',
            message: error.message,
          });
        });
    });
  }

  if (event.data && event.data.type === 'DELETE_EXPIRED_CACHE') {
    console.log('Cleaning expired caches...');
    event.waitUntil(
      deleteExpiredCacheEntries().then(() => {
        event.source.postMessage({ type: 'CACHE_CLEARED' });
      })
    );
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
  const requestUrl = event.request.url;
  if (requestUrl.includes(VIDEO_URL)) {
    event.respondWith(handleMedia(event, MEDIA_TYPES.VIDEO));
  } else if (requestUrl.includes(AUDIO_URL)) {
    event.respondWith(handleMedia(event, MEDIA_TYPES.AUDIO));
  }
});

async function handleMedia(event, mediaType) {
  const { request } = event;
  const { slug, decryptionKey } = extractParams(request);
  const apiUrl = await getApiUrl();
  const range = event.request.headers.get('range');

  if (!slug) {
    return createErrorResponse('Requires slug.', 400, mediaType);
  }

  if (!apiUrl) {
    return createErrorResponse('Requires backend url.', 400, mediaType);
  }

  if (!range) {
    return createErrorResponse('Requires Range header.', 400, mediaType);
  }

  try {
    const tokenResponse = await fetchTokenWithCache(apiUrl, slug);
    if (!tokenResponse || tokenResponse.error) {
      return createErrorResponse(tokenResponse?.error, 400, mediaType);
    }

    const file = await fetchFileMetadataWithCache(
      apiUrl,
      slug,
      tokenResponse.jwt_ott
    );
    if (!file || file.error) {
      return createErrorResponse(file?.error, 400, mediaType);
    }

    const isEncrypted = !!file.is_clientside_encrypted;
    const isOnStorageProvider = !!file.is_on_storage_provider;
    const fileSize = file.converted_size ?? file.size;

    if (isEncrypted && !decryptionKey) {
      return createErrorResponse(
        'Decryption key is required for encrypted files.',
        400,
        mediaType
      );
    }
    const key = isEncrypted ? decryptionKey : undefined;

    const { gateway } = tokenResponse;

    const {
      start,
      end,
      chunksIndex,
      contentLength,
      fileEnd,
      fileStart,
      level,
    } = calculateRange({
      range,
      fileSize,
      isOnStorageProvider,
      gateway,
      isEncrypted,
    });

    let cids;
    if (isOnStorageProvider) {
      cids = await fetchCIDsWithCache({
        apiUrl,
        slug,
        level,
        jwt_ott: tokenResponse.jwt_ott,
      });
      if (!cids || cids.error) {
        return createErrorResponse(cids?.error, 400, mediaType);
      }
    }

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': file.mime,
    };

    const readableStream = new ReadableStream({
      start(controller) {
        (async () => {
          try {
            for (const chunkIndex of chunksIndex) {
              const filePath = `${slug}-${chunkIndex}.mp4`;

              if (!(await caches.match(filePath))) {
                const readable = isOnStorageProvider
                  ? await downloadFromStorageProvider({
                      file,
                      gateway,
                      chunkIndex,
                      level,
                      key,
                      cids,
                    })
                  : await downloadFromBackend({
                      file,
                      key,
                      tokenResponse,
                      chunkIndex,
                    });

                if (readable?.failed || !readable) {
                  throw new Error(readable?.message ?? DEFAULT_ERROR_MESSAGE);
                }

                await caches.open(CACHE_KEYS[mediaType]).then((cache) => {
                  const response = new Response(readable, {
                    headers: { Date: new Date().toUTCString() },
                  });
                  return cache.put(filePath, response);
                });
              }

              const cache = await caches.open(CACHE_KEYS[mediaType]);
              const cachedResponse = await cache.match(filePath);
              const chunk = await cachedResponse.arrayBuffer();
              const uint8Array = new Uint8Array(
                chunk.slice(fileStart, fileEnd + 1)
              );
              controller.enqueue(uint8Array);
            }
            controller.close();
          } catch (error) {
            const message = error?.message || DEFAULT_ERROR_MESSAGE;
            if (!message.includes('ReadableStreamDefaultController')) {
              await sendErrorToClients(message, mediaType);
            }

            controller.error(error);
          }
        })();
      },
    });

    return new Response(readableStream, { status: 206, headers });
  } catch (error) {
    return createErrorResponse(DEFAULT_ERROR_MESSAGE, 500, mediaType);
  }
}

async function isCacheValid(cachedResponse, cacheKey) {
  const cacheTime = cachedResponse.headers.get('date');
  if (cacheTime) {
    const cachedDate = new Date(cacheTime);
    const currentTime = Date.now();
    return currentTime - cachedDate.getTime() < EXPIRATION_TIMES[cacheKey];
  }
  return false;
}

async function fetchTokenWithCache(apiUrl, slug) {
  const cache = await caches.open(CACHE_KEYS.TOKEN);
  const cachedResponse = await cache.match(slug);

  if (cachedResponse) {
    if (await isCacheValid(cachedResponse, CACHE_KEYS.TOKEN)) {
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
    if (await isCacheValid(cachedResponse, CACHE_KEYS.ENTRY)) {
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
    return { error: data.errors || 'Failed to fetch media data.' };
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

async function sendErrorToClients(message, mediaType) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });

  clients.forEach((client) => {
    client.postMessage({
      type: mediaType === MEDIA_TYPES.VIDEO ? 'VIDEO_ERROR' : 'AUDIO_ERROR',
      message,
    });
  });
}

async function createErrorResponse(message, statusCode, mediaType) {
  const response = new Response(JSON.stringify({ error: message }), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await sendErrorToClients(message, mediaType);

  return response;
}

async function fetchCIDsWithCache({ apiUrl, slug, jwt_ott, level }) {
  const cache = await caches.open(CACHE_KEYS.CIDS);
  const cachedResponse = await cache.match(slug);

  if (cachedResponse) {
    if (await isCacheValid(cachedResponse, CACHE_KEYS.CIDS)) {
      return await cachedResponse.json();
    } else {
      await cache.delete(slug);
    }
  }

  const response = await fetchCIDs({ apiUrl, slug, jwt_ott, level });
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

async function fetchCIDs({ apiUrl, slug, jwt_ott, level }) {
  const response = await fetch(`${apiUrl}/files/file/cid/${slug}/${level}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Download-OTT-JWT': jwt_ott,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    return { error: data.errors || 'Failed to fetch CIDs.' };
  }
  return data.cids;
}

async function downloadFromStorageProvider({
  file,
  gateway,
  chunkIndex,
  key,
  level,
  cids,
}) {
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
          "Failed to execute 'atob' on 'WorkerGlobalScope': The string to be decoded is not correctly encoded."
      ) {
        return { failed: true, message: DECRYPTION_KEY_ERROR_MESSAGE };
      }
    }
  }

  return chunk;
}

function calculateRange({
  range,
  fileSize,
  isOnStorageProvider,
  gateway,
  isEncrypted,
}) {
  const { interim_chunk_size, upload_chunk_size } = gateway;
  const chunkSizeByLevel = {
    interim: interim_chunk_size,
    upload: upload_chunk_size,
  };

  const rangeParts = range.replace(/bytes=/, '').split('-');
  const requestedStart = Number(rangeParts[0]);
  const endPart = rangeParts[1];
  const requestedEnd = endPart ? Number(endPart) : fileSize;
  const requestedBytes = requestedEnd - requestedStart;
  const isInterim =
    isEncrypted || (endPart && requestedBytes > upload_chunk_size);
  const level = isInterim ? 'interim' : 'upload';

  const chunkSize = isOnStorageProvider
    ? chunkSizeByLevel[level]
    : upload_chunk_size;

  const chunksIndex = getChunksForRange({
    requestedStart,
    requestedEnd,
    chunkSize,
    hasRangeEnd: endPart,
  });

  const start = requestedStart;

  const end = Math.min(
    chunksIndex.at(-1) * chunkSize + chunkSize - 1,
    fileSize - 1,
    requestedEnd
  );

  const contentLength = end - start + 1;

  const fileStart = Math.max(0, start % chunkSize);
  const totalSize = chunksIndex.length * chunkSize;
  const fileEnd = Math.min(totalSize, end % totalSize);

  return {
    start,
    end,
    contentLength,
    chunksIndex,
    fileStart,
    fileEnd,
    level,
  };
}

function getChunksForRange({
  requestedStart,
  requestedEnd,
  hasRangeEnd,
  chunkSize,
}) {
  const chunkStartIndex =
    requestedStart === 0 ? 0 : Math.floor(requestedStart / chunkSize);

  if (!hasRangeEnd) {
    return [chunkStartIndex];
  }

  const chunkEndIndex = Math.floor(requestedEnd / chunkSize);

  const chunkIndices = [];
  for (let i = chunkStartIndex; i <= chunkEndIndex; i++) {
    chunkIndices.push(i);
  }

  return chunkIndices;
}
