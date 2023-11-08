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
const ethers_v5_1 = require("ethers-v5");
const networks_1 = require("@ethersproject/networks");
const { BaseProvider } = ethers_v5_1.providers;
const { hexlify, hexValue, accessListify } = ethers_v5_1.utils;
const lava_sdk_1 = require("@lavanet/lava-sdk");
function getLowerCase(value) {
    if (value) {
        return value.toLowerCase();
    }
    return value;
}
class LavaEthersProvider extends BaseProvider {
    constructor(options, networkId) {
        super(LavaEthersProvider.getNetworkPromise(options, networkId));
        this.lavaSdkOptions = options;
    }
    static getNetworkPromise(options, networkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chainIds = options.chainIds;
            if (chainIds instanceof Array) {
                throw "etheres integration supports one chain per instance";
            }
            if (networkId) {
                const network = (0, networks_1.getNetwork)({
                    name: chainIds,
                    chainId: networkId,
                });
                return network;
            }
            const lavaSDK = yield this.createLavaSDK(options);
            const response = yield lavaSDK.sendRelay({
                method: "eth_chainId",
                params: [],
            });
            const parsedNetworkId = parseInt(JSON.parse(response).result, 16);
            const network = (0, networks_1.getNetwork)({
                name: chainIds,
                chainId: parsedNetworkId,
            });
            return network;
        });
    }
    static createLavaSDK(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return lava_sdk_1.LavaSDK.create(options);
        });
    }
    static create(options, networkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new LavaEthersProvider(options, networkId);
            yield provider.init();
            return provider;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.lavaSdk = yield LavaEthersProvider.createLavaSDK(this.lavaSdkOptions);
        });
    }
    perform(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (method) {
                case "getBlockNumber": {
                    return this.fetch("eth_blockNumber", []);
                }
                case "getGasPrice": {
                    return this.fetch("eth_gasPrice", []);
                }
                case "getBlock": {
                    if (params.blockTag) {
                        const blockNumber = typeof params.blockTag === "number"
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
                        }
                        else {
                            params.filter.address = getLowerCase(params.filter.address);
                        }
                    }
                    return this.fetch("eth_getLogs", [params.filter]);
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
                // parse response
                const parsedResponse = response;
                // return result
                if (parsedResponse.result != undefined) {
                    return parsedResponse.result;
                }
                if (parsedResponse.error.message != undefined) {
                    throw new Error(parsedResponse.error.message);
                }
                // Log response if we are not handling it
                throw new Error("Unhlendled response");
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTransactionPostData(transaction) {
        const result = {};
        for (const key in transaction) {
            if (transaction[key] == null) {
                continue;
            }
            let value = transaction[key];
            if (key === "type" && value === 0) {
                continue;
            }
            // Quantity-types require no leading zero, unless 0
            if ({
                type: true,
                gasLimit: true,
                gasPrice: true,
                maxFeePerGs: true,
                maxPriorityFeePerGas: true,
                nonce: true,
                value: true,
            }[key]) {
                value = hexValue(hexlify(value));
            }
            else if (key === "accessList") {
                value =
                    "[" +
                        accessListify(value)
                            .map((set) => {
                            return `{address:"${set.address}",storageKeys:["${set.storageKeys.join('","')}"]}`;
                        })
                            .join(",") +
                        "]";
            }
            else {
                value = hexlify(value);
            }
            result[key] = value;
        }
        return result;
    }
    // Return initialized network
    detectNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.network;
        });
    }
}
exports.LavaEthersProvider = LavaEthersProvider;