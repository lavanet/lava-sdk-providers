import { LavaSDKOptions } from "@lavanet/lava-sdk";
import { LavaEthersProvider } from "../src/provider/lavaEthersProvider";

async function createEthersLavaProvider(
  options: LavaSDKOptions,
  networkId?: number
): Promise<LavaEthersProvider> {
  // ## Options A: ##
  const provider = await LavaEthersProvider.create(options, networkId);

  // ## Options B: ##
  // const provider = new LavaEthersProvider(options);
  // await provider.init();
  //
  //
  // ## Options C: ##
  // # In this case, the provider will be initialized automatically on the first request #
  // const provider = new LavaEthersProvider(options);

  return provider;
}

async function printLatestBlockWithBadges() {
  const ethersProvider = await createEthersLavaProvider(
    {
      badge: {
        badgeServerAddress: "https://badges.lavanet.xyz", // Or your own Badge-Server URL
        projectId: "//", // Get your Own on gateway.lavanet.xyz
      },
      chainIds: "ETH1",
      geolocation: "1",
      logLevel: "info",
    },
    1 // the evm chain id, optional
  );

  const latestBlock = await ethersProvider.getBlock("latest");

  console.log(latestBlock);
}

async function printLatestBlock() {
  const ethersProvider = await createEthersLavaProvider(
    {
      privateKey: process.env.PRIVATE_KEY,
      chainIds: "ETH1",
      geolocation: "1",
      pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
      lavaChainId: "lava",
      logLevel: "info",
      allowInsecureTransport: true,
    },
    1 // the evm chain id, optional
  );

  const latestBlock = await ethersProvider.getBlock("latest");

  console.log(latestBlock);
}
try {
  (async (): Promise<void> => await printLatestBlockWithBadges())();
} catch (e) {
  (async (): Promise<void> => await printLatestBlock())();
}
