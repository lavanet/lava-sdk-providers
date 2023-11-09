import { providers } from "ethers-v5";
import { Network } from "@ethersproject/networks";
import { TransactionRequest } from "@ethersproject/abstract-provider";
declare const BaseProvider: typeof providers.BaseProvider;
import { LavaSDKOptions } from "@lavanet/lava-sdk";
export interface EthersLavaSDKOptions extends Omit<LavaSDKOptions, "chainIds"> {
    chainId: string;
    networkId?: number;
}
export declare class LavaEthersProvider extends BaseProvider {
    private lavaSdk;
    private lavaSdkOptions;
    constructor(options: LavaSDKOptions, networkId?: number);
    private static getNetworkPromise;
    private static createLavaSDK;
    static create(options: LavaSDKOptions, networkId?: number): Promise<LavaEthersProvider>;
    init(): Promise<void>;
    perform(method: string, params: any): Promise<any>;
    fetch(method: string, params: Array<any>): Promise<any>;
    getTransactionPostData(transaction: TransactionRequest): Record<string, string>;
    detectNetwork(): Promise<Network>;
}
export {};
