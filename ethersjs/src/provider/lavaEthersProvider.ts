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
} from "ethers/types/providers";
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

export class LavaEthersProvider extends AbstractProvider {
  private lavaSDK: LavaSDK | null;
  private network!: Network;

  constructor(options: SendRelayOptions) {
    super();

    if (options.networkId == undefined) {
      options.networkId = fetchNetworkID(options.chainID);
    }

    this.network = new Network(options.chainID, options.networkId);
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

  async _perform(req: PerformActionRequest): Promise<any> {
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
    if (this.lavaSDK == null) {
      throw new Error("Lava SDK not initialized");
    }

    // send relay using lavaSDK
    const response = await this.lavaSDK.sendRelay({
      method: method,
      params: params,
    });

    // parse response
    const parsedResponse = JSON.parse(response);

    // return result
    return parsedResponse.result;
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
    return this.network;
  }
}
