import { providers, utils } from "ethers";
import { Network, getNetwork } from "@ethersproject/networks";
import { TransactionRequest } from "@ethersproject/abstract-provider";

const { BaseProvider } = providers;
const { hexlify, hexValue, accessListify } = utils;

import { LavaSDK } from "@lavanet/lava-sdk";

import { fetchNetworkID } from "../util/utils";

interface SendRelayOptions {
  chainID: string;
  privKey: string;
  pairingListConfig?: string;
  networkId?: number;
}

function getLowerCase(value: string): string {
  if (value) {
    return value.toLowerCase();
  }
  return value;
}

export class LavaEthersProvider extends BaseProvider {
  private lavaSDK: LavaSDK | null;

  constructor(options: SendRelayOptions) {
    if (options.networkId == undefined) {
      options.networkId = fetchNetworkID(options.chainID);
    }

    const network = getNetwork({
      name: options.chainID,
      chainId: options.networkId,
    });

    super(network);

    this.lavaSDK = null;

    return (async (): Promise<LavaEthersProvider> => {
      this.lavaSDK = await new LavaSDK({
        privateKey: options.privKey,
        chainID: options.chainID,
        pairingListConfig: options.pairingListConfig,
      });

      return this;
    })() as unknown as LavaEthersProvider;
  }

  async perform(method: string, params: any): Promise<any> {
    switch (method) {
      case "getBlockNumber": {
        return this.fetch("eth_blockNumber", []);
      }

      case "getGasPrice": {
        return this.fetch("eth_gasPrice", []);
      }

      case "getBlock": {
        if (params.blockTag) {
          const blockNumber =
            typeof params.blockTag === "number"
              ? params.blockTag.toString()
              : params.blockTag;
          return this.fetch("eth_getBlockByNumber", [
            blockNumber,
            params.includeTransactions,
          ]);
        }
      }

      case "getTransaction": {
        return this.fetch("eth_getTransactionByHash", [params.hash]);
      }

      case "getTransactionReceipt": {
        return this.fetch("eth_getTransactionReceipt", [params.hash]);
      }

      case "getTransactionCount": {
        return this.fetch("eth_getTransactionCount", [
          params.address,
          params.blockTag,
        ]);
      }

      case "getBalance": {
        return this.fetch("eth_getBalance", [params.address, params.blockTag]);
      }

      case "getCode": {
        return this.fetch("eth_getCode", [params.address, params.blockTag]);
      }

      case "getStorage": {
        return this.fetch("eth_getStorageAt", [
          params.address,
          params.position,
          params.blockTag,
        ]);
      }

      case "getGasPrice": {
        return this.fetch("eth_gasPrice", []);
      }

      case "broadcastTransaction": {
        return this.fetch("eth_sendRawTransaction", [params.signedTransaction]);
      }

      case "chainId": {
        return this.fetch("eth_chainId", []);
      }

      case "call": {
        return this.fetch("eth_call", [
          this.getTransactionPostData(params.transaction),
          params.blockTag,
        ]);
      }

      case "estimateGas": {
        return this.fetch("eth_estimateGas", [
          this.getTransactionPostData(params.transaction),
        ]);
      }

      case "getLogs": {
        if (params.filter && params.filter.address != null) {
          if (Array.isArray(params.filter.address)) {
            params.filter.address = params.filter.address.map(getLowerCase);
          } else {
            params.filter.address = getLowerCase(params.filter.address);
          }
        }
        return this.fetch("eth_getLogs", [params.filter]);
      }

      default:
        break;
    }
  }

  async fetch(method: string, params: Array<any>): Promise<any> {
    // make sure lavaSDK was initialized
    if (this.lavaSDK == null) {
      throw new Error("Lava SDK not initialized");
    }

    // send relay using lavaSDK
    try {
      const response = await this.lavaSDK.sendRelay({
        method: method,
        params: params,
      });

      // parse response
      const parsedResponse = JSON.parse(response);

      // return result
      if (parsedResponse.result != undefined) {
        return parsedResponse.result;
      }

      if (parsedResponse.error.message != undefined) {
        throw new Error(parsedResponse.error.message);
      }

      // Log response if we are not handling it
      throw new Error("Unhlendled response");
    } catch (err) {
      throw err;
    }
  }

  getTransactionPostData(
    transaction: TransactionRequest
  ): Record<string, string> {
    const result: Record<string, string> = {};
    for (let key in transaction) {
      if ((<any>transaction)[key] == null) {
        continue;
      }
      let value = (<any>transaction)[key];
      if (key === "type" && value === 0) {
        continue;
      }

      // Quantity-types require no leading zero, unless 0
      if (
        (<any>{
          type: true,
          gasLimit: true,
          gasPrice: true,
          maxFeePerGs: true,
          maxPriorityFeePerGas: true,
          nonce: true,
          value: true,
        })[key]
      ) {
        value = hexValue(hexlify(value));
      } else if (key === "accessList") {
        value =
          "[" +
          accessListify(value)
            .map((set) => {
              return `{address:"${
                set.address
              }",storageKeys:["${set.storageKeys.join('","')}"]}`;
            })
            .join(",") +
          "]";
      } else {
        value = hexlify(value);
      }
      result[key] = value;
    }
    return result;
  }

  // Return initialized network
  async detectNetwork(): Promise<Network> {
    return this.network;
  }
}
