import { JsonRpcRequest, JsonRpcSuccessResponse } from "@cosmjs/json-rpc";
import { RpcClient } from "@cosmjs/tendermint-rpc";
import { LavaSDKOptions } from "@lavanet/lava-sdk";
export declare class LavaCosmJsRPCClient implements RpcClient {
    private lavaSdkOptions;
    private lavaSdk;
    constructor(options: LavaSDKOptions);
    init(): Promise<void>;
    static create(options: LavaSDKOptions): Promise<LavaCosmJsRPCClient>;
    execute(request: JsonRpcRequest): Promise<JsonRpcSuccessResponse>;
    disconnect(): void;
}
