const fs = require('fs');
const path = require('path');

let projectRoot = process.cwd();

const isInNodeModules = projectRoot.includes('node_modules');
if (isInNodeModules) {
  projectRoot = path.resolve(projectRoot, '../../');
}

const sourceIpldPaths = [
  path.resolve(
    projectRoot,
    'node_modules',
    '@ipld',
    'car',
    'dist',
    'index.min.js'
  ),
  path.resolve(
    process.cwd(),
    'node_modules',
    '@ipld',
    'car',
    'dist',
    'index.min.js'
  ),
];

const gatewayPaths = [
  path.resolve(
    projectRoot,
    'node_modules',
    'gdgateway-client',
    'dist',
    'bundle.umd.js'
  ),
  path.resolve(
    process.cwd(),
    'node_modules',
    'gdgateway-client',
    'dist',
    'bundle.umd.js'
  ),
];

const sourceServiceWorkerPath = path.resolve(
  process.cwd(),
  'src',
  'workers',
  'service-worker.js'
);

const destPublicPath = path.resolve(projectRoot, 'public');

if (!fs.existsSync(destPublicPath)) {
  fs.mkdirSync(destPublicPath, { recursive: true });
}

const checkAndCopyFileWithRetries = (
  filePaths,
  destPath,
  retries = 10,
  delay = 10000
) => {
  let attempts = 0;

  const tryCopyFile = () => {
    attempts++;
    const fileExists = filePaths.some((filePath) => fs.existsSync(filePath));

    if (fileExists) {
      const existingFilePath = filePaths.find((filePath) =>
        fs.existsSync(filePath)
      );
      fs.copyFileSync(existingFilePath, destPath);
    } else {
      if (attempts < retries) {
        console.log(`Files not found. Retrying in ${delay / 1000} seconds...`);
        setTimeout(tryCopyFile, delay);
      } else {
        console.error(
          `Error: File bundle.umd.js not found after ${retries} attempts.`
        );
        process.exit(1);
      }
    }
  };

  tryCopyFile();
};

try {
  checkAndCopyFileWithRetries(
    gatewayPaths,
    path.join(destPublicPath, 'bundle.umd.js')
  );

  const sourceIpldPath = sourceIpldPaths.find((path) => fs.existsSync(path));
  if (!sourceIpldPath) {
    throw new Error('Required file missing for @ipld/car');
  }
  fs.copyFileSync(sourceIpldPath, path.join(destPublicPath, 'index.min.js'));

  if (!fs.existsSync(sourceServiceWorkerPath)) {
    throw new Error(`Required file missing: ${sourceServiceWorkerPath}`);
  }
  fs.copyFileSync(
    sourceServiceWorkerPath,
    path.join(destPublicPath, 'service-worker.js')
  );
} catch (err) {
  console.error('Error during postinstall:', err.message);
  process.exit(1);
}
