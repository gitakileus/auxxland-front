const debug = true;
const ABI = require('./abi/ContractABI.json');
const Address = "0xc95f4bf1f9a7359CC545fDf59d9bfD3A2BBCDe5F";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

export const web3 = createAlchemyWeb3('https://bsc-dataseed.binance.org/');
export const Contract = new web3.eth.Contract(ABI, Address);
export const bscNetworkId = debug ? "97" : "56"
