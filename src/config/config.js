export const DEBUG = true;
export const INFURA_ID = "bffe89818dc34affb16204015432cc96";
export const MAINNET_RPC_URL = `https://bsc-dataseed1.binance.org/`;
export const TESTNET_RPC_URL = `https://data-seed-prebsc-1-s3.binance.org:8545/`;
// export const HARDHAT_URL = "http://localhost:8545";

export const DAPP_READONLY_RPC = !DEBUG
  ? "https://bsc-dataseed1.binance.org/"
  : "https://data-seed-prebsc-1-s1.binance.org:8545/";
export const NETWORK_ID = DEBUG ? 97 : 56;
export const RPC_URL = DAPP_READONLY_RPC;
export const NETWORK_NAME = DEBUG ? "BscTestnet" : "Bsc" ;

export const CONTRACT_ADDRESS = "0xd38874B576CA09d714Ab1dc94773798fd44b0FB9";
