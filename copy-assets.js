const fs = require('fs');
const path = require('path');

let projectRoot = process.cwd();
if (projectRoot.includes('node_modules')) {
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
const sourceGatewayPath = path.resolve(
  projectRoot,
  'node_modules',
  'gdgateway-client',
  'dist',
  'bundle.umd.js'
);
const sourceServiceWorkerPath = path.resolve(
  projectRoot,
  'node_modules',
  'fe-ui-kit',
  'src',
  'workers',
  'service-worker.js'
);

const destPublicPath = path.resolve(projectRoot, 'public');

if (!fs.existsSync(destPublicPath)) {
  fs.mkdirSync(destPublicPath);
}

try {
  fs.copyFileSync(sourceIpldPath, path.join(destPublicPath, 'index.min.js'));
  console.log(`Copied ${sourceIpldPath} to ${destPublicPath}/index.min.js`);

  fs.copyFileSync(
    sourceGatewayPath,
    path.join(destPublicPath, 'bundle.umd.js')
  );
  console.log(`Copied ${sourceGatewayPath} to ${destPublicPath}/bundle.umd.js`);

  fs.copyFileSync(
    sourceServiceWorkerPath,
    path.join(destPublicPath, 'service-worker.js')
  );
  console.log(
    `Copied ${sourceServiceWorkerPath} to ${destPublicPath}/service-worker.js`
  );
} catch (err) {
  console.error('Error copying files:', err);
}
