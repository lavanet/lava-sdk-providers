import { JsonRpcRequest, JsonRpcSuccessResponse } from "@cosmjs/json-rpc";
import { RpcClient } from "@cosmjs/tendermint-rpc";
import { LavaSDK, LavaSDKOptions } from "@lavanet/lava-sdk";

export class LavaCosmJsRPCClient implements RpcClient {
  private lavaSdkOptions: LavaSDKOptions;
  private lavaSdk: LavaSDK | undefined;

  constructor(options: LavaSDKOptions) {
    this.lavaSdkOptions = options;
  }

  async init() {
    this.lavaSdk = await LavaSDK.create(this.lavaSdkOptions);
  }

  static async create(options: LavaSDKOptions) {
    const client = new LavaCosmJsRPCClient(options);
    await client.init();
    return client;
  }

  async execute(request: JsonRpcRequest): Promise<JsonRpcSuccessResponse> {
    if (!this.lavaSdk) {
      console.log("Lava SDK not initialized, initiating now");
      await this.init();
    }

    return this.lavaSdk?.sendRelay({
      method: request.method,
      params: request.params as any[],
    });
  }

  disconnect(): void {
    return;
  }
}
