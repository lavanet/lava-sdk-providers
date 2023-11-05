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
const lavaEthersProvider_1 = require("../src/provider/lavaEthersProvider");
function createEthersLavaProvider(options, networkId) {
    return __awaiter(this, void 0, void 0, function* () {
        // ## Options A: ##
        const provider = yield lavaEthersProvider_1.LavaEthersProvider.create(options, networkId);
        // ## Options B: ##
        // const provider = new LavaEthersProvider(options);
        // await provider.init();
        //
        //
        // ## Options C: ##
        // # In this case, the provider will be initialized automatically on the first request #
        // const provider = new LavaEthersProvider(options);
        return provider;
    });
}
function printLatestBlockWithBadges() {
    return __awaiter(this, void 0, void 0, function* () {
        const ethersProvider = yield createEthersLavaProvider({
            badge: {
                badgeServerAddress: "https://badges.lavanet.xyz",
                projectId: "//", // Get your Own on gateway.lavanet.xyz
            },
            chainIds: "ETH1",
            geolocation: "1",
            logLevel: "info",
        }, 1);
        const latestBlock = yield ethersProvider.getBlock("latest");
        console.log(latestBlock);
    });
}
function printLatestBlock() {
    return __awaiter(this, void 0, void 0, function* () {
        const ethersProvider = yield createEthersLavaProvider({
            privateKey: process.env.PRIVATE_KEY,
            chainIds: "ETH1",
            geolocation: "1",
            pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
            lavaChainId: "lava",
            logLevel: "info",
            allowInsecureTransport: true,
        }, 1);
        const latestBlock = yield ethersProvider.getBlock("latest");
        console.log(latestBlock);
    });
}
try {
    (() => __awaiter(void 0, void 0, void 0, function* () { return yield printLatestBlockWithBadges(); }))();
}
catch (e) {
    (() => __awaiter(void 0, void 0, void 0, function* () { return yield printLatestBlock(); }))();
}
