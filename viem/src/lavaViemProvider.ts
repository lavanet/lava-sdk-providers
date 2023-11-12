import { LavaSDK, LavaSDKOptions, SendRelayOptions } from "@lavanet/lava-sdk";
import { createPublicClient, custom } from "viem";

export async function createViemClientWithLavaSDK(options: LavaSDKOptions) {
  const lava = await LavaSDK.create(options);

  return createPublicClient({
    transport: custom({
      async request(options: SendRelayOptions) {
        if (!options.params) {
          options = { ...options, params: [] };
        }

        const response = await lava.sendRelay(options);
        if (!response["result"]) {
          return response;
        }

        return response["result"];
      },
    }),
  });
}
