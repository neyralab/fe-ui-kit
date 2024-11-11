const fs = require('fs');
const path = require('path');

let projectRoot = process.cwd();

const isInNodeModules = projectRoot.includes('node_modules');
if (isInNodeModules) {
  projectRoot = path.resolve(projectRoot, '../../');
}

const sourceIpldPath = path.resolve(
  projectRoot,
  'node_modules',
  '@ipld',
  'car',
  'dist',
  'index.min.js'
);

// Check both possible paths for gdgateway-client
let sourceGatewayPath = path.resolve(
  projectRoot,
  'node_modules',
  'gdgateway-client',
  'dist',
  'bundle.umd.js'
);

if (!fs.existsSync(sourceGatewayPath)) {
  // If not in root node_modules, check fe-ui-kit's node_modules
  sourceGatewayPath = path.resolve(
    process.cwd(),
    'node_modules',
    'gdgateway-client',
    'dist',
    'bundle.umd.js'
  );
}

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

try {
  if (!fs.existsSync(sourceIpldPath)) {
    throw new Error(`Required file missing: ${sourceIpldPath}`);
  }
  fs.copyFileSync(sourceIpldPath, path.join(destPublicPath, 'index.min.js'));

  if (!fs.existsSync(sourceGatewayPath)) {
    throw new Error(`Required file missing: ${sourceGatewayPath}`);
  }
  fs.copyFileSync(
    sourceGatewayPath,
    path.join(destPublicPath, 'bundle.umd.js')
  );

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
