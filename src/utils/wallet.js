import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "../config/ProviderOptions";
import { NETWORK_NAME } from "../config/config";

// let web3Modal;
export let modal;
export let selectedSinger;
export let provider;

const web3Modal = new Web3Modal({
  network: NETWORK_NAME, // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

export const disconnectWallet = async () => {
  try {
    return await web3Modal.clearCachedProvider();
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const showWeb3WalletModal = async () => {
  try {
    modal = await web3Modal.connect();
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  return modal;
};

export const getCurrentWalletAddress = async () => {
  try {
    if (web3Modal.cachedProvider) {
      modal = await web3Modal.connect();
    } else {
      return "";
    }
    // Get a Web3 instance for the wallet
    provider = new ethers.providers.Web3Provider(modal);
    // const accounts = await provider.eth.getAccounts();
    selectedSinger = await provider.getSigner();
    const address = await selectedSinger.getAddress();
    return address;
  } catch (e) {
    // console.error('Could not getCurrentWalletAddress', e);
    return "";
  }
};

export const getCurrentBalance = async (address) => {
  try {
    if (web3Modal.cachedProvider) {
      modal = await web3Modal.connect();
    } else {
      return null;
    }
    // Get a Web3 instance for the wallet
    const provider = new ethers.providers.Web3Provider(modal);
    const balance = await provider.getBalance(address);
    return balance;
  } catch (e) {
    return null;
  }
};

export const getSigner = async () => {
  try {
    if (web3Modal.cachedProvider) {
      modal = await web3Modal.connect();
    } else {
      return null;
    }
    // Get a Web3 instance for the wallet
    const provider = new ethers.providers.Web3Provider(modal);
    const signer = provider.getSigner();
    return signer;
  } catch (e) {
    return null;
  }
};

export const getCurrentNetworkInfo = async () => {
  try {
    if (web3Modal.cachedProvider) {
      modal = await web3Modal.connect();
    } else {
      return null;
    }
    const provider = new ethers.providers.Web3Provider(modal);
    return await provider.getNetwork();
  } catch (e) {
    // console.error('Could not getCurrentNetworkId', e);
    return null;
  }
};

export const switchNetwork = async (network) => {
  let currentChainInfo = await getCurrentNetworkInfo();
  if (network === currentChainInfo.chainId) {
    return true;
  }
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: network }],
    });
    return true;
  } catch (switchError) {
    console.log(switchError);
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: network,
              rpcUrl: 'https://bsc-dataseed1.binance.org/',
            },
          ],
        });
        return true;
      } catch (addError) {
        return false;
      }
    }
    return false;
  }
};

export default web3Modal;
