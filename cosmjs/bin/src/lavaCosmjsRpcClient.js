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
exports.LavaCosmJsRPCClient = void 0;
const lava_sdk_1 = require("@lavanet/lava-sdk");
class LavaCosmJsRPCClient {
    constructor(options) {
        this.lavaSdkOptions = options;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.lavaSdk = yield lava_sdk_1.LavaSDK.create(this.lavaSdkOptions);
        });
    }
    static create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new LavaCosmJsRPCClient(options);
            yield client.init();
            return client;
        });
    }
    execute(request) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.lavaSdk) {
                console.log("Lava SDK not initialized, initiating now");
                yield this.init();
            }
            return (_a = this.lavaSdk) === null || _a === void 0 ? void 0 : _a.sendRelay({
                method: request.method,
                params: request.params,
            });
        });
    }
    disconnect() {
        return;
    }
}
exports.LavaCosmJsRPCClient = LavaCosmJsRPCClient;
