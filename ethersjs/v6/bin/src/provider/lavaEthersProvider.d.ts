import { AbstractProvider, Network } from "ethers";
import { PerformActionRequest, TransactionRequest, JsonRpcTransactionRequest } from "ethers";
import { LavaSDKOptions } from "@lavanet/lava-sdk";
export declare class LavaEthersProvider extends AbstractProvider {
    private lavaSdk;
    private network;
    private lavaSdkOptions;
    private networkId;
    constructor(options: LavaSDKOptions, networkId?: number);
    init(): Promise<void>;
    static create(options: LavaSDKOptions, networkId?: number): Promise<LavaEthersProvider>;
    _perform(req: PerformActionRequest): Promise<any>;
    fetch(method: string, params: Array<any>): Promise<any>;
    getRpcTransaction(tx: TransactionRequest): JsonRpcTransactionRequest;
    _detectNetwork(): Promise<Network>;
}
