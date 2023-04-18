"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNetworkID = void 0;
const supportedChains_json_1 = __importDefault(require("../../supportedChains.json"));
// fetchNetworkID fetches default networkID for chainID
function fetchNetworkID(chainID) {
    const wantedData = supportedChains_json_1.default.filter((item) => item.chainID === chainID);
    if (wantedData.length !== 1) {
        return -1;
    }
    return wantedData[0].networkID;
}
exports.fetchNetworkID = fetchNetworkID;
