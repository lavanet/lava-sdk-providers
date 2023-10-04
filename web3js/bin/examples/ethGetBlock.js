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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const lavaWeb3jsProvider_1 = require("../src/lavaWeb3jsProvider");
function createWeb3Instance(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // ## Options A: ##
        const provider = yield lavaWeb3jsProvider_1.LavaWeb3Provider.create(options);
        // ## Options B: ##
        // const provider = new LavaWeb3Provider(options);
        // await provider.init();
        //
        //
        // ## Options C: ##
        // # In this case, the provider will be initialized automatically on the first request #
        // const provider = new LavaWeb3Provider(options);
        return new web3_1.default(provider);
    });
}
createWeb3Instance({
    privateKey: process.env.PRIVATE_KEY,
    chainIds: "ETH1",
    geolocation: "1",
    pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
    lavaChainId: "lava",
    logLevel: "info",
    allowInsecureTransport: true,
})
    .then((web3) => {
    return web3.eth.getBlock();
})
    .then((block) => {
    console.log(block);
})
    .catch((err) => {
    console.error(err);
});