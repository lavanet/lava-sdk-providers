import {
  EthersLavaSDKOptions,
  LavaEthersProvider,
} from "../src/provider/lavaEthersProvider";

async function createEthersLavaProvider(
  options: EthersLavaSDKOptions
): Promise<LavaEthersProvider> {
  // ## Options A: ##
  const provider = await LavaEthersProvider.create(options);

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

async function printLatestBlock() {
  const ethersProvider = await createEthersLavaProvider({
    privateKey: process.env.PRIVATE_KEY,
    chainId: "ETH1",
    geolocation: "1",
    pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
    lavaChainId: "lava",
    logLevel: "info",
    allowInsecureTransport: true,
  });

  const latestBlock = await ethersProvider.getBlock("latest");

  console.log(latestBlock);
}

(async (): Promise<void> => await printLatestBlock())();
