<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img src="https://user-images.githubusercontent.com/2770565/223762290-44afc792-8ad4-4dbb-b2c2-532780d6c5de.png" alt="Logo" width="80" height="80">
  <h3 align="center">Lava Ethers Provider - <i>ALPHA</i></h3>
  </p>
</div>

<b>Use the Ethers.js, the Lava way 🌋</b>

This repository contains implementations of Ether.js provider using [Lava-SDK](https://github.com/lavanet/lava-sdk) to achive decentralized access.

<!-- Prerequisites -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Installation -->

## Installation

### Prerequisites (Alpha version)

_SDK setup requires additional steps at the moment, but we're working on minimizing prerequisites as we progress through the roadmap._

1. Create a wallet on the Lava Testnet, have LAVA tokens
1. Stake in the chain you want to access
1. Stake in Lava chain

Need help? We've got you covered 😻 Head over to our [Discord](https://discord.gg/5VcqgwMmkA) channel `#developers` and we'll provide testnet tokens and further support

### Yarn

```bash
yarn add lava-sdk-providers
```

### NPM

```bash
npm install lava-sdk-providers
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### Importing the LavaEthersProvider

The LavaEthersProvider supports multiple versions. We support version 5.x and the latest version, which is version 6.x. If a user wants to import, this is how to do it:

```typescript
Copy code
import { LavaEthersProvider } from "lava-sdk-provider/ethers/v5"; // for version 5
import { LavaEthersProvider } from "lava-sdk-provider/ethers/v6"; // for version 6
```

### Initializing the LavaEthersProvider

To use the LavaEthersProvider, you will first need to initialize it.

```typescript
// Use init()
const ethersProvider = new LavaEthersProvider({
  privateKey: privateKey,
  chainId: chainId,
  pairingListConfig: localConfigPath, // Optional
  networkId: networkId, // Optional
  geolocation: geolocation, //Optional
});

await ethersProvider.init();
```

or 

```typescript
// Use create()
const ethersProvider = await LavaEthersProvider.create({
  privateKey: privateKey,
  chainId: chainId,
  pairingListConfig: localConfigPath, // Optional
  networkId: networkId, // Optional
  geolocation: geolocation, //Optional
});
```

or 

```typescript
// Lazy init: 
//  * The init() will be called automatically on first request
const ethersProvider = new LavaEthersProvider({
  privateKey: privateKey,
  chainId: chainId,
  pairingListConfig: localConfigPath, // Optional
  networkId: networkId, // Optional
  geolocation: geolocation, //Optional
});
```

- `privateKey` parameter is required and should be the private key of the staked Lava client for the specified `chainID`.

- `chainId` parameter is required and should be the ID of the chain you want to query. You can find all supported chains with their IDs [supportedChains](https://github.com/lavanet/lava-sdk-providers/blob/main/ethersjs/supportedChains.json)

- `pairingListConfig` is an optional field that specifies the lava pairing list config used for communicating with lava network. Lava SDK does not rely on one centralized rpc for querying lava network. It uses a list of rpc providers to fetch list of the providers for specified `chainID` and `rpcInterface` from lava network. If not pairingListConfig set, the default list will be used [default lava pairing list](https://github.com/lavanet/lava-providers/blob/main/pairingList.json)

- `networkId` represents chain id of the network we want to query. By default every supported chain has matching chain id (https://github.com/lavanet/lava-sdk-providers/blob/main/ethersjs/supportedChains.json)

- `geolocation` is an optional field that specifies the geolocation which will be used. Default value is 1 which represents North America providers. Besides North America providers, lava supports EU providers on geolocation 2.

Once the LavaEthersProvider is initialized, you can use any method provided by the Ether.js library to interact with the blockchain. For example, to get the latest block number, you can use the following code:

```typescript
const blockNumber = await ethersProvider.getBlockNumber();
```

This will return the block number of the latest block on the specified chain. You can find more information on available methods in the official [Ether.js documentation](https://docs.ethers.org/v5/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Troubleshooting -->

# Troubleshooting

### <b> Webpack >= 5 </b>

If you are using `create-react-app` version 5 or higher, or `Angular` version 11 or higher, you may encounter build issues. This is because these versions use `webpack version 5`, which does not include Node.js polyfills.

#### <b> Create-react-app solution </b>

1. Install react-app-rewired and the missing modules:

```bash
yarn add --dev react-app-rewired crypto-browserify stream-browserify browserify-zlib assert stream-http https-browserify os-browserify url buffer process net tls bufferutil utf-8-validate path-browserify
```

2. Create `config-overrides.js` in the root of your project folder

```javascript
const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    zlib: require.resolve("browserify-zlib"),
    fs: false,
    bufferutil: require.resolve("bufferutil"),
    "utf-8-validate": require.resolve("utf-8-validate"),
    path: require.resolve("path-browserify"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });
  return config;
};
```

3. In the `package.json` change the script for start, test, build and eject:

```JSON
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
},
```
