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
exports.LavaWeb3Provider = void 0;
const lava_sdk_1 = require("@lavanet/lava-sdk");
const web3_1 = require("web3");
class LavaWeb3Provider extends web3_1.Web3BaseProvider {
    constructor(options) {
        super();
        this.lavaSdkOptions = options;
    }
    static create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new LavaWeb3Provider(options);
            yield provider.init();
            return provider;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * Initialize the Lava SDK
             *
             * @remarks
             * If init is not called before using the provider, it will be called automatically on the first request
             */
            this.lavaSdk = yield lava_sdk_1.LavaSDK.create({
                privateKey: this.lavaSdkOptions.privateKey,
                chainIds: this.lavaSdkOptions.chainIds,
                geolocation: this.lavaSdkOptions.geolocation,
                pairingListConfig: this.lavaSdkOptions.pairingListConfig,
                lavaChainId: this.lavaSdkOptions.lavaChainId,
                logLevel: this.lavaSdkOptions.logLevel,
                allowInsecureTransport: this.lavaSdkOptions.allowInsecureTransport,
            });
        });
    }
    supportsSubscriptions() {
        return false;
    }
    request(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lavaSdk) {
                console.log("Lava SDK not initialized, initiating now");
                yield this.init();
            }
            return (_a = this.lavaSdk) === null || _a === void 0 ? void 0 : _a.sendRelay({
                method: args.method,
                params: args.params,
            });
        });
    }
    getStatus() {
        throw new web3_1.MethodNotImplementedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    on(type, listener) {
        throw new web3_1.MethodNotImplementedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(type, listener) {
        throw new web3_1.MethodNotImplementedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    once(type, listener) {
        throw new web3_1.MethodNotImplementedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeAllListeners(type) {
        throw new web3_1.MethodNotImplementedError();
    }
    connect() {
        throw new web3_1.MethodNotImplementedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    disconnect(code, data) {
        throw new web3_1.MethodNotImplementedError();
    }
    reset() {
        throw new web3_1.MethodNotImplementedError();
    }
}
exports.LavaWeb3Provider = LavaWeb3Provider;
