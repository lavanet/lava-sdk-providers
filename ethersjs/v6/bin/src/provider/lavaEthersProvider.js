"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavaEthersProvider = void 0;
const ethers_1 = require("ethers");
const lava_sdk_1 = require("@lavanet/lava-sdk");
function getLowerCase(value) {
    if (value) {
        return value.toLowerCase();
    }
    return value;
}
class LavaEthersProvider extends ethers_1.AbstractProvider {
    constructor(options, networkId) {
        super();
        this.lavaSdkOptions = options;
        this.networkId = networkId;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const chainId = this.lavaSdkOptions.chainIds;
            if (chainId instanceof Array) {
                throw "lavad-sdk ethers integration supports one chain at a time";
            }
            this.lavaSdk = yield lava_sdk_1.LavaSDK.create(this.lavaSdkOptions);
            if (this.networkId == undefined) {
                // fetch chain id from the provider
                const response = yield this.lavaSdk.sendRelay({
                    method: "eth_chainId",
                    params: [],
                });
                this.networkId = response.result;
            }
            this.network = new ethers_1.Network(chainId, this.networkId);
        });
    }
    static create(options, networkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new LavaEthersProvider(options, networkId);
            yield provider.init();
            return provider;
        });
    }
    _perform(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lavaSdk) {
                console.log("Lava SDK not initialized, initiating now");
                yield this.init();
            }
            switch (req.method) {
                case "getBlockNumber": {
                    return this.fetch("eth_blockNumber", []);
                }
                case "getBlock": {
                    if ("blockTag" in req) {
                        const blockNumber = typeof req.blockTag === "number"
                            ? req.blockTag.toString()
                            : req.blockTag;
                        return this.fetch("eth_getBlockByNumber", [
                            blockNumber,
                            req.includeTransactions,
                        ]);
                    }
                    (0, ethers_1.assert)(false, "getBlock by blockHash not supported by Lava", "UNSUPPORTED_OPERATION", {
                        operation: "getBlock(blockHash)",
                    });
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
                        }
                        else {
                            req.filter.address = getLowerCase(req.filter.address);
                        }
                    }
                    return this.fetch("eth_getLogs", [req.filter]);
                }
                default:
                    break;
            }
        });
    }
    fetch(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            // make sure lavaSDK was initialized
            if (this.lavaSdk == null) {
                throw new Error("Lava SDK not initialized");
            }
            // send relay using lavaSDK
            try {
                const response = yield this.lavaSdk.sendRelay({
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
            }
            catch (err) {
                throw err;
            }
        });
    }
    getRpcTransaction(tx) {
        const result = {};
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
            if (tx[key] == null) {
                return;
            }
            let dstKey = key;
            if (key === "gasLimit") {
                dstKey = "gas";
            }
            result[dstKey] = (0, ethers_1.toQuantity)((0, ethers_1.getBigInt)(tx[key], `tx.${key}`));
        });
        // Make sure addresses and data are lowercase
        ["from", "to", "data"].forEach((key) => {
            if (tx[key] == null) {
                return;
            }
            result[key] = (0, ethers_1.hexlify)(tx[key]);
        });
        // Normalize the access list object
        if (tx.accessList) {
            result["accessList"] = (0, ethers_1.accessListify)(tx.accessList);
        }
        return result;
    }
    // Return initialized network
    _detectNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.network == null) {
                throw new Error("Network not defined");
            }
            return this.network;
        });
    }
}
exports.LavaEthersProvider = LavaEthersProvider;
