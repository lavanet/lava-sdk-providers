import { LavaSDK, LavaSDKOptions } from "@lavanet/lava-sdk";
import {
  EthExecutionAPI,
  JsonRpcResponseWithResult,
  JsonRpcResult,
  MethodNotImplementedError,
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
  Web3APIPayload,
  Web3BaseProvider,
  Web3Eip1193ProviderEventCallback,
  Web3ProviderEventCallback,
  Web3ProviderMessageEventCallback,
  Web3ProviderStatus,
} from "web3";

export class LavaWeb3Provider extends Web3BaseProvider<EthExecutionAPI> {
  private lavaSdk: LavaSDK | undefined;
  private lavaSdkOptions: LavaSDKOptions;

  constructor(options: LavaSDKOptions) {
    super();
    this.lavaSdkOptions = options;
  }

  static async create(options: LavaSDKOptions): Promise<LavaWeb3Provider> {
    const provider = new LavaWeb3Provider(options);
    await provider.init();
    return provider;
  }

  async init() {
    /**
     * Initialize the Lava SDK
     *
     * @remarks
     * If init is not called before using the provider, it will be called automatically on the first request
     */
    this.lavaSdk = await LavaSDK.create(this.lavaSdkOptions);
  }

  supportsSubscriptions(): boolean {
    return false;
  }

  async request<Method extends string, ResultType = unknown>(
    args: Web3APIPayload<EthExecutionAPI, Method>
  ): Promise<JsonRpcResponseWithResult<ResultType>> {
    if (!this.lavaSdk) {
      console.log("Lava SDK not initialized, initiating now");
      await this.init();
    }

    return this.lavaSdk?.sendRelay({
      method: args.method,
      params: args.params as any[],
    });
  }

  getStatus(): Web3ProviderStatus {
    throw new MethodNotImplementedError();
  }
  on(
    type: "disconnect",
    listener: Web3Eip1193ProviderEventCallback<ProviderRpcError>
  ): void;
  on<T = JsonRpcResult>(
    type: string,
    listener:
      | Web3Eip1193ProviderEventCallback<ProviderMessage>
      | Web3ProviderMessageEventCallback<T>
  ): void;
  on<T = JsonRpcResult>(
    type: string,
    listener:
      | Web3Eip1193ProviderEventCallback<ProviderMessage>
      | Web3ProviderMessageEventCallback<T>
  ): void;
  on(
    type: "connect",
    listener: Web3Eip1193ProviderEventCallback<ProviderConnectInfo>
  ): void;
  on(
    type: "chainChanged",
    listener: Web3Eip1193ProviderEventCallback<string>
  ): void;
  on(
    type: "accountsChanged",
    listener: Web3Eip1193ProviderEventCallback<string[]>
  ): void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on(type: unknown, listener: unknown): void {
    throw new MethodNotImplementedError();
  }
  removeListener(
    type: "disconnect",
    listener: Web3Eip1193ProviderEventCallback<ProviderRpcError>
  ): void;
  removeListener<T = JsonRpcResult>(
    type: string,
    listener:
      | Web3Eip1193ProviderEventCallback<ProviderMessage>
      | Web3ProviderEventCallback<T>
  ): void;
  removeListener(
    type: "connect",
    listener: Web3Eip1193ProviderEventCallback<ProviderConnectInfo>
  ): void;
  removeListener(
    type: "chainChanged",
    listener: Web3Eip1193ProviderEventCallback<string>
  ): void;
  removeListener(
    type: "accountsChanged",
    listener: Web3Eip1193ProviderEventCallback<string[]>
  ): void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeListener(type: unknown, listener: unknown): void {
    throw new MethodNotImplementedError();
  }
  once(
    type: "disconnect",
    listener: Web3Eip1193ProviderEventCallback<ProviderRpcError>
  ): void;
  once<T = JsonRpcResult>(
    type: string,
    listener:
      | Web3Eip1193ProviderEventCallback<ProviderMessage>
      | Web3ProviderEventCallback<T>
  ): void;
  once(
    type: "connect",
    listener: Web3Eip1193ProviderEventCallback<ProviderConnectInfo>
  ): void;
  once(
    type: "chainChanged",
    listener: Web3Eip1193ProviderEventCallback<string>
  ): void;
  once(
    type: "accountsChanged",
    listener: Web3Eip1193ProviderEventCallback<string[]>
  ): void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  once(type: unknown, listener: unknown): void {
    throw new MethodNotImplementedError();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeAllListeners?(type: string): void {
    throw new MethodNotImplementedError();
  }
  connect(): void {
    throw new MethodNotImplementedError();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disconnect(code?: number | undefined, data?: string | undefined): void {
    throw new MethodNotImplementedError();
  }
  reset(): void {
    throw new MethodNotImplementedError();
  }
}
