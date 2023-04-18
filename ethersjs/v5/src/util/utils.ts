import supportedChains from "../../supportedChains.json";

// fetchNetworkID fetches default networkID for chainID
export function fetchNetworkID(chainID: string): number {
  const wantedData = supportedChains.filter((item) => item.chainID === chainID);

  if (wantedData.length !== 1) {
    return -1;
  }

  return wantedData[0].networkID as number;
}
