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

To use the LavaEthersProvider, you will first need to import and initialize it.

```typescript
const ethersProvider = await new LavaEthersProvider({
  privKey: privKey,
  chainID: chainID,
  pairingListConfig: localConfigPath, // Optional
  networkId: networkID, // Optional
});
```

- `privateKey` parameter is required and should be the private key of the staked Lava client for the specified `chainID`.

- `chainID` parameter is required and should be the ID of the chain you want to query. You can find all supported chains with their IDs [supportedChains](https://github.com/lavanet/lava-sdk-providers/blob/main/ethersjs/supportedChains.json)

- `pairingListConfig` is an optional field that specifies the lava pairing list config used for communicating with lava network. Lava SDK does not rely on one centralized rpc for querying lava network. It uses a list of rpc providers to fetch list of the providers for specified `chainID` and `rpcInterface` from lava network. If not pairingListConfig set, the default list will be used [default lava pairing list](https://github.com/lavanet/lava-providers/blob/main/pairingList.json)

- `networkId` represents chain id of the network we want to query. By default every supported chain has matching chain id (https://github.com/lavanet/lava-sdk-providers/blob/main/ethersjs/supportedChains.json)

Once the LavaEthersProvider is initialized, you can use any method provided by the Ether.js library to interact with the blockchain. For example, to get the latest block number, you can use the following code:

```typescript
const blockNumber = await ethersProvider.getBlockNumber();
```

This will return the block number of the latest block on the specified chain. You can find more information on available methods in the official [Ether.js documentation](https://docs.ethers.org/v5/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
