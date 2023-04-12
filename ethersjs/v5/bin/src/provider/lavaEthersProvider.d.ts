import { providers } from "ethers";
import { Network } from "@ethersproject/networks";
import { TransactionRequest } from "@ethersproject/abstract-provider";
declare const BaseProvider: typeof providers.BaseProvider;
interface SendRelayOptions {
    chainID: string;
    privKey: string;
    pairingListConfig?: string;
    networkId?: number;
}
export declare class LavaEthersProvider extends BaseProvider {
    private lavaSDK;
    constructor(options: SendRelayOptions);
    perform(method: string, params: any): Promise<any>;
    fetch(method: string, params: Array<any>): Promise<any>;
    getTransactionPostData(transaction: TransactionRequest): Record<string, string>;
    detectNetwork(): Promise<Network>;
}
export {};
