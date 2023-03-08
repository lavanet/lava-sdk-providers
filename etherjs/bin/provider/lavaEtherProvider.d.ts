import { AbstractProvider, Network } from "ethers";
import { PerformActionRequest, TransactionRequest, JsonRpcTransactionRequest } from "ethers/types/providers";
interface SendRelayOptions {
    chainID: string;
    privKey: string;
    pairingListConfig?: string;
    networkId: number;
}
export declare class LavaEtherProvider extends AbstractProvider {
    private lavaSDK;
    private network;
    constructor(options: SendRelayOptions);
    _perform(req: PerformActionRequest): Promise<any>;
    fetch(method: string, params: Array<any>): Promise<any>;
    getRpcTransaction(tx: TransactionRequest): JsonRpcTransactionRequest;
    _detectNetwork(): Promise<Network>;
}
export {};
