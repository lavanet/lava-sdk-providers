import { providers } from "ethers-v5";
import { Network } from "@ethersproject/networks";
import { TransactionRequest } from "@ethersproject/abstract-provider";
declare const BaseProvider: typeof providers.BaseProvider;
interface SendRelayOptions {
    chainID: string;
    privKey: string;
    pairingListConfig?: string;
    networkId?: number;
    geolocation?: string;
    lavaChainId?: string;
}
export declare class LavaEthersProvider extends BaseProvider {
    private lavaSDK;
    constructor(options: SendRelayOptions);
    private static getNetworkPromise;
    perform(method: string, params: any): Promise<any>;
    fetch(method: string, params: Array<any>): Promise<any>;
    getTransactionPostData(transaction: TransactionRequest): Record<string, string>;
    detectNetwork(): Promise<Network>;
}
export {};
