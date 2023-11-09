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
        projectId: "//", // Fetch your project ID from https://gateway.lavanet.xyz
      },
      chainIds: "ETH1",
      geolocation: "1",
      logLevel: "info",
    },
    1
  );
  const latestBlock = await ethersProvider.getBlock("latest");
  console.log(latestBlock);
}

// for backend usage with a private key, get your own for free on gateway.lavanet.xyz
// this example is for local testing, for production usage check the examples in the docs or gateway (change lavaChainId & allowInsecureTransport)
async function printLatestBlock() {
  const ethersProvider = await createEthersLavaProvider({
    privateKey: process.env.PRIVATE_KEY,
    chainIds: "ETH1",
    geolocation: "1",
    pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
    lavaChainId: "lava",
    logLevel: "info",
    allowInsecureTransport: true,
  });

  const latestBlock = await ethersProvider.getBlock("latest");

  console.log(latestBlock);
}
try {
  (async (): Promise<void> => await printLatestBlockWithBadges())();
} catch (e) {
  (async (): Promise<void> => await printLatestBlock())();
}
