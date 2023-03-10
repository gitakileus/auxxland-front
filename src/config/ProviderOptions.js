import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { INFURA_ID } from './config';

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "Web 3 Modal Demo", // Required
      infuraId: INFURA_ID, // Required unless you provide a JSON RPC url; see `rpc` below
    }
  },
};
