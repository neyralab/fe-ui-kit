# FE UI Kit

**FE UI Kit** is a React component library that offers a collection of pre-built, UI elements.

## Installation

Install the library via **npm** or **yarn**:

```bash
# Using npm
npm install github:neyralab/fe-ui-kit

# Using yarn
yarn add github:neyralab/fe-ui-kit
```

## Peer Dependencies
FE UI Kit relies on certain peer dependencies, which need to be installed in your project for compatibility. Ensure you have the following versions of `react`, `react-dom`, and `@ipld/car` installed:

```javascript
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0",
  "react-dom": "^17.0.0 || ^18.0.0",
  "@ipld/car": "^5.2.4"
}
```

> 📌 **Note**: For better compatibility, we recommend having **client-gateway** version **1.6.1 or above** installed in your project.


## Post-Installation Script
After installing the library, a post-installation script will copy specific files to the public folder of your project. These files are necessary for certain functionalities in FE UI Kit and will be automatically managed upon installation. The files copied include:

- service-worker.js
- index.min.js
- bundle.umd.js

To prevent these files from being committed to your repository, you may wish to add them to your `.gitignore` file.

## Components and Icons
Explore the full range of available components and icons:

- [Components](https://github.com/neyralab/fe-ui-kit/tree/main/src/components)
- [Icons](https://github.com/neyralab/fe-ui-kit/tree/main/src/icons)
