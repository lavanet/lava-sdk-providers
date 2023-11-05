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
const tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
const lavaCosmjsRpcClient_1 = require("../src/lavaCosmjsRpcClient");
function createTendermintClientInstance(rpcClientName, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // ## Options A: ##
        const client = yield lavaCosmjsRpcClient_1.LavaCosmJsRPCClient.create(options);
        // ## Options B: ##
        // const provider = new LavaCosmJsRPCClient(options);
        // await provider.init();
        //
        //
        // ## Options C: ##
        // # In this case, the provider will be initialized automatically on the first request #
        // const provider = new LavaCosmJsRPCClient(options);
        switch (rpcClientName) {
            case "tendermint34":
                return tendermint_rpc_1.Tendermint34Client.create(client);
            case "tendermint37":
                return tendermint_rpc_1.Tendermint37Client.create(client);
            default:
                throw new Error(`Unknown RPC client: ${rpcClientName}`);
        }
    });
}
function printLatestBlockWithBadges(rpcClientName) {
    return __awaiter(this, void 0, void 0, function* () {
        const tendermingClient = yield createTendermintClientInstance(rpcClientName, {
            badge: {
                badgeServerAddress: "https://badges.lavanet.xyz",
                projectId: "//", // Get your Own on gateway.lavanet.xyz
            },
            chainIds: "LAV1",
            geolocation: "1",
            logLevel: "info",
        });
        const latestBlock = yield tendermingClient.abciInfo();
        return latestBlock;
    });
}
function printLatestBlock(rpcClientName) {
    return __awaiter(this, void 0, void 0, function* () {
        const tendermingClient = yield createTendermintClientInstance(rpcClientName, {
            privateKey: process.env.PRIVATE_KEY,
            chainIds: "LAV1",
            geolocation: "1",
            pairingListConfig: process.env.PAIRING_LIST_CONFIG_PATH,
            lavaChainId: "lava",
            logLevel: "info",
            allowInsecureTransport: true,
        });
        const latestBlock = yield tendermingClient.abciInfo();
        return latestBlock;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const rpcClientNames = ["tendermint34", "tendermint37"];
    rpcClientNames.forEach((rpcClientName, _) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const latestBlock = yield printLatestBlockWithBadges(rpcClientName);
            console.log(`##### Using rpcClient: ${rpcClientName} #####`);
            console.log(latestBlock);
            console.log("\n\n");
        }
        catch (e) {
            const latestBlock = yield printLatestBlock(rpcClientName);
            console.log(`##### Using rpcClient: ${rpcClientName} #####`);
            console.log(latestBlock);
            console.log("\n\n");
        }
    }));
}))();
