import { createViemClientWithLavaSDK } from "../src/lavaViemProvider";

// Backend usage with a subscribed private key.
// A pre subscribed key can be set for free on https://gateway.lavanet.xyz .
async function printLatestBlock() {
  const viem = await createViemClientWithLavaSDK({
    privateKey: process.env.PRIVATE_KEY,
    chainIds: "ETH1",
    geolocation: "1",
    pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
    lavaChainId: "lava",
    logLevel: "info",
    allowInsecureTransport: true,
  });

  const latestBlock = await viem.request({
    method: "eth_blockNumber",
  });

  console.log(latestBlock);
}

async function printLatestBlockWithBadges() {
  const viem = await createViemClientWithLavaSDK({
    badge: {
      badgeServerAddress: "https://badges.lavanet.xyz", // Or your own Badge-Server URL
      projectId: "//", // Fetch your project ID from https://gateway.lavanet.xyz
    },
    chainIds: "ETH1",
    logLevel: "info",
    geolocation: "2", // Put your geolocation here
  });

  const latestBlock = await viem.request({
    method: "eth_blockNumber",
  });

  console.log(latestBlock);

  const blockInfo = await viem.request({
    method: "eth_getBlockByNumber",
    params: [latestBlock, false],
  });

  console.log(blockInfo);
}

try {
  console.log("Starting with badges decentralized access");
  (async (): Promise<void> => await printLatestBlockWithBadges())();
} catch (e) {
  (async (): Promise<void> => await printLatestBlock())();
}
