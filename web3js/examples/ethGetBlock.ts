import { LavaSDKOptions } from "@lavanet/lava-sdk";
import Web3 from "web3";

import { LavaWeb3Provider } from "../src/lavaWeb3Provider";

async function createWeb3Instance(options: LavaSDKOptions): Promise<Web3> {
  // ## Options A: ##
  const provider = await LavaWeb3Provider.create(options);

  // ## Options B: ##
  // const provider = new LavaWeb3Provider(options);
  // await provider.init();
  //
  //
  // ## Options C: ##
  // # In this case, the provider will be initialized automatically on the first request #
  // const provider = new LavaWeb3Provider(options);

  return new Web3(provider);
}

// backend usage with a private key
// can be generated for free on gateway.lavanet.xyz
async function printLatestBlock() {
  const web3 = await createWeb3Instance({
    privateKey: process.env.PRIVATE_KEY,
    chainIds: "ETH1",
    geolocation: "1",
    pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
    lavaChainId: "lava",
    logLevel: "info",
    allowInsecureTransport: true,
  });

  const latestBlock = await web3.eth.getBlock();

  console.log(latestBlock);
}

async function printLatestBlockWithBadges() {
  const web3 = await createWeb3Instance({
    badge: {
      badgeServerAddress: "https://badges.lavanet.xyz", // Or your own Badge-Server URL
      projectId: "//", // Fetch your project ID from https://gateway.lavanet.xyz
    },
    chainIds: "ETH1",
    logLevel: "info",
    geolocation: "2", // Put your geolocation here
  });

  const latestBlock = await web3.eth.getBlock();

  console.log(latestBlock);
}

try {
  console.log("starting with badges decentralised access");
  (async (): Promise<void> => await printLatestBlockWithBadges())();
} catch (e) {
  (async (): Promise<void> => await printLatestBlock())();
}
