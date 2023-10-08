import {
  AbstractProvider,
  Network,
  assert,
  accessListify,
  toQuantity,
  hexlify,
  getBigInt,
} from "ethers";
import {
  PerformActionRequest,
  TransactionRequest,
  JsonRpcTransactionRequest,
} from "ethers";
import { LavaSDK, LavaSDKOptions } from "@lavanet/lava-sdk";

function getLowerCase(value: string): string {
  if (value) {
    return value.toLowerCase();
  }
  return value;
}

export interface EthersLavaSDKOptions extends Omit<LavaSDKOptions, "chainIds"> {
  chainId: string;
  networkId?: number;
}

export class LavaEthersProvider extends AbstractProvider {
  private lavaSdk: LavaSDK | undefined;
  private network: Network | undefined;
  private lavaSdkOptions: EthersLavaSDKOptions;

  constructor(options: EthersLavaSDKOptions) {
    super();
    this.lavaSdkOptions = options;
  }

  async init() {
    this.lavaSdk = await LavaSDK.create({
      ...this.lavaSdkOptions,
      chainIds: this.lavaSdkOptions.chainId,
    });

    if (this.lavaSdkOptions.networkId == undefined) {
      // fetch chain id from the provider
      const response = await this.lavaSdk.sendRelay({
        method: "eth_chainId",
        params: [],
      });

      this.lavaSdkOptions.networkId = response.result as number;
    }

    this.network = new Network(
      this.lavaSdkOptions.chainId,
      this.lavaSdkOptions.networkId
    );
  }

  static async create(
    options: EthersLavaSDKOptions
  ): Promise<LavaEthersProvider> {
    const provider = new LavaEthersProvider(options);
    await provider.init();
    return provider;
  }

  async _perform(req: PerformActionRequest): Promise<any> {
    if (!this.lavaSdk) {
      console.log("Lava SDK not initialized, initiating now");
      await this.init();
    }

    switch (req.method) {
      case "getBlockNumber": {
        return this.fetch("eth_blockNumber", []);
      }

      case "getBlock": {
        if ("blockTag" in req) {
          const blockNumber =
            typeof req.blockTag === "number"
              ? req.blockTag.toString()
              : req.blockTag;
          return this.fetch("eth_getBlockByNumber", [
            blockNumber,
            req.includeTransactions,
          ]);
        }

        assert(
          false,
          "getBlock by blockHash not supported by Lava",
          "UNSUPPORTED_OPERATION",
          {
            operation: "getBlock(blockHash)",
          }
        );
      }

      case "getTransaction": {
        return this.fetch("eth_getTransactionByHash", [req.hash]);
      }

      case "getTransactionReceipt": {
        return this.fetch("eth_getTransactionReceipt", [req.hash]);
      }

      case "getTransactionCount": {
        return this.fetch("eth_getTransactionCount", [
          req.address,
          req.blockTag,
        ]);
      }

      case "getBalance": {
        return this.fetch("eth_getBalance", [req.address, req.blockTag]);
      }

      case "getCode": {
        return this.fetch("eth_getCode", [req.address, req.blockTag]);
      }

      case "getStorage": {
        return this.fetch("eth_getStorageAt", [
          req.address,
          req.position,
          req.blockTag,
        ]);
      }

      case "getGasPrice": {
        return this.fetch("eth_gasPrice", []);
      }

      case "broadcastTransaction": {
        return this.fetch("eth_sendRawTransaction", [req.signedTransaction]);
      }

      case "chainId": {
        return this.fetch("eth_chainId", []);
      }

      case "call": {
        return this.fetch("eth_call", [
          this.getRpcTransaction(req.transaction),
          req.blockTag,
        ]);
      }

      case "estimateGas": {
        return this.fetch("eth_estimateGas", [
          this.getRpcTransaction(req.transaction),
        ]);
      }

      case "getLogs": {
        if (req.filter && req.filter.address != null) {
          if (Array.isArray(req.filter.address)) {
            req.filter.address = req.filter.address.map(getLowerCase);
          } else {
            req.filter.address = getLowerCase(req.filter.address);
          }
        }
        return this.fetch("eth_getLogs", [req.filter]);
      }

      default:
        break;
    }
  }

  async fetch(method: string, params: Array<any>): Promise<any> {
    // make sure lavaSDK was initialized
    if (this.lavaSdk == null) {
      throw new Error("Lava SDK not initialized");
    }

    // send relay using lavaSDK
    try {
      const response = await this.lavaSdk.sendRelay({
        method: method,
        params: params,
      });

      // return result
      if (response.result != undefined) {
        return response.result;
      }

      if (response.error.message != undefined) {
        throw new Error(response.error.message);
      }

      // Log response if we are not handling it
      throw new Error("Unhandled response");
    } catch (err) {
      throw err;
    }
  }

  getRpcTransaction(tx: TransactionRequest): JsonRpcTransactionRequest {
    const result: JsonRpcTransactionRequest = {};

    // JSON-RPC now requires numeric values to be "quantity" values
    [
      "chainId",
      "gasLimit",
      "gasPrice",
      "type",
      "maxFeePerGas",
      "maxPriorityFeePerGas",
      "nonce",
      "value",
    ].forEach((key) => {
      if ((<any>tx)[key] == null) {
        return;
      }
      let dstKey = key;
      if (key === "gasLimit") {
        dstKey = "gas";
      }
      (<any>result)[dstKey] = toQuantity(
        getBigInt((<any>tx)[key], `tx.${key}`)
      );
    });

    // Make sure addresses and data are lowercase
    ["from", "to", "data"].forEach((key) => {
      if ((<any>tx)[key] == null) {
        return;
      }
      (<any>result)[key] = hexlify((<any>tx)[key]);
    });

    // Normalize the access list object
    if (tx.accessList) {
      result["accessList"] = accessListify(tx.accessList);
    }

    return result;
  }

  // Return initialized network
  async _detectNetwork(): Promise<Network> {
    if (this.network == null) {
      throw new Error("Network not defined");
    }
    return this.network;
  }
}
