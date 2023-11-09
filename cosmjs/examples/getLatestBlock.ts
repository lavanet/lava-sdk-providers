import { LavaSDKOptions } from "@lavanet/lava-sdk";
import {
  Tendermint34Client,
  Tendermint37Client,
  TendermintClient,
} from "@cosmjs/tendermint-rpc";

import {} from "@cosmjs/tendermint-rpc";

import { LavaCosmJsRPCClient } from "../src/lavaCosmjsRpcClient";

async function createTendermintClientInstance(
  rpcClientName: string,
  options: LavaSDKOptions
): Promise<TendermintClient> {
  // ## Options A: ##
  const client = await LavaCosmJsRPCClient.create(options);

  // ## Options B: ##
  // const provider = new LavaCosmJsRPCClient(options);
  // await provider.init();
  //
  //
  // ## Options C: ##
  // # In this case, the provider will be initialized automatically on the first request #
  // const provider = new LavaCosmJsRPCClient(options);

  switch (rpcClientName) {
    case "tendermint34":
      return Tendermint34Client.create(client);
    case "tendermint37":
      return Tendermint37Client.create(client);
    default:
      throw new Error(`Unknown RPC client: ${rpcClientName}`);
  }
}

async function printLatestBlockWithBadges(rpcClientName: string) {
  const tendermingClient = await createTendermintClientInstance(rpcClientName, {
    badge: {
      badgeServerAddress: "https://badges.lavanet.xyz", // Or your own Badge-Server URL
      projectId: "//", // Fetch your project ID from https://gateway.lavanet.xyz
    },
    chainIds: "LAV1",
    geolocation: "1",
  });

  const latestBlock = await tendermingClient.abciInfo();
  return latestBlock;
}

async function printLatestBlock(rpcClientName: string) {
  const tendermingClient = await createTendermintClientInstance(rpcClientName, {
    privateKey: process.env.PRIVATE_KEY,
    chainIds: "LAV1",
    geolocation: "1",
    pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
    lavaChainId: "lava",
    logLevel: "info",
    allowInsecureTransport: true,
  });

  const latestBlock = await tendermingClient.abciInfo();
  return latestBlock;
}

(async (): Promise<void> => {
  const rpcClientNames = ["tendermint34", "tendermint37"];
  rpcClientNames.forEach(async (rpcClientName, _) => {
    try {
      const latestBlock = await printLatestBlockWithBadges(rpcClientName);
      console.log(`##### Using rpcClient: ${rpcClientName} #####`);
      console.log(latestBlock);
      console.log("\n\n");
    } catch (e) {
      const latestBlock = await printLatestBlock(rpcClientName);
      console.log(`##### Using rpcClient: ${rpcClientName} #####`);
      console.log(latestBlock);
      console.log("\n\n");
    }
  });
})();
