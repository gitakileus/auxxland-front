import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from './assets/logo.png';
import image5 from './assets/image 5.png'
import image6 from './assets/Purple Simple NFT Sale Instagram Post (13) (1) 1.png'
import image7 from './assets/emzikoj_beautiful_futuristic_city_with_art_galleries_unreal_eng_559fafc4-a304-45c9-91e7-4c821696e388 1.png'
import image8 from './assets/emzikoj_opening_on_a_futuristic_art_gallery_632efd99-5452-46fc-8c8c-dbc0e84a81a8 1.png'
import image81 from './assets/emzikoj_opening_on_a_futuristic_art_gallery_632efd99-5452-46fc-8c8c-dbc0e84a81a8 2.png'
import image9 from './assets/NFT Paris Auxxio (1) 1.png'

import './App.css';
import { ethers } from "ethers";
import web3Modal, { getCurrentWalletAddress, getCurrentBalance, getCurrentNetworkInfo, showWeb3WalletModal, selectedSinger } from './utils/wallet'
import { shortenAddress } from "./utils/helper"
import { NETWORK_ID, CONTRACT_ADDRESS } from "./config/config"
const ContractABI = require('./abi/ContractABI.json');

const tokenPrice = 0.1

function App() {
  const [walletstring, setWalStr] = useState('Connect Wallet')
  const [account, setAccount] = useState('')
  const [numOfMinted, setNum] = useState(0)
  const [amount, setAmount] = useState(0)
  const [balance, setBalance] = useState(0)
  const [contract, setContract] = useState(null)

  const txtol = {
    "textShadow": ['-1px -1px 0 #BB20FA', '1px -1px 0 #BB20FA', '-1px 1px 0 #BB20FA', '1px 1px 0 #BB20FA']
  }

  const submitemail = (id) => {
    document.getElementById(id).value = ''
  }

  const Mint = async () => {
    if (account === '' || !contract) {
      toast(<div style={{ "color": "red" }}>Please connect wallet first.</div>)
      return
    }

    let chainInfo = await getCurrentNetworkInfo();
    if (chainInfo.chainId !== NETWORK_ID) {
      toast.warn("Please change to Bsc Network!");
      return
    }

    if (amount === 0) {
      toast(<div style={{ "color": "red" }}>Please set the amount correctly.</div>)
      return
    }

    if (amount > 5) {
      toast(<div style={{ "color": "red" }}>You can only mint less than 5 nfts at one time.</div>)
      return
    }

    if (balance < amount * 0.1) {
      toast.warn("You don't have enough balance to mint!");
      return
    }

    try {
      const mintTx = await contract.mint(amount, {
        value: ethers.utils.parseEther(`${tokenPrice * amount}`),
      });

      const temp = await mintTx.wait();
      console.log(temp)

      toast(<div style={{ "color": "green" }}>AUXXLAND Minted Successfully!</div>)

      const currentbalance = await getCurrentBalance(window.ethereum.selectedAddress);
      setBalance(ethers.utils.formatEther(currentbalance));
    } catch (e) {
      console.log(e)
    }
  }

  const getTotalSupply = async () => {
    const mintC = await contract.totalSupply()
    setNum(mintC.toNumber())
  }

  const connectWallet = async () => {
    try {
      await showWeb3WalletModal();
      const address = await getCurrentWalletAddress();
      if (address === "") {
        return
      }
      setWalStr(shortenAddress(address))
      const balance = await getCurrentBalance(address);
      setBalance(ethers.utils.formatEther(balance));
      setAccount(address);
      let chainInfo = await getCurrentNetworkInfo();
      if (chainInfo.chainId !== NETWORK_ID) {
        toast.warn("Please change to Bsc Network!");
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContractABI,
        selectedSinger
      );

      setContract(contract)
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (contract) {
      getTotalSupply()

      contract?.on("minted", (value) => {
        console.log(value);
        setNum(value.toNumber())
      });
    }
  }, [contract])

  const handleChange = (e) => {
    setAmount(e.target.value)
  }

  const handleUP = () => {
    const elemet = document.getElementById("up")
    window.scrollTo({ top: elemet?.offsetTop || 0, behavior: 'smooth' })
  }

  return (
    <div className='overflow-x-hidden'>
      <nav class="bg-[#00043D] px-2 sm:px-4 py-2.5 w-full z-20 top-0 left-0 z-20">
        <div class="container flex flex-wrap items-center justify-between mx-auto">
          <a href="https://auxx.io/" class="flex items-center">
            <img src={logo} class="mr-3 w-24" alt="Flowbite Logo" />
            {/* <span class="self-center font-semibold whitespace-nowrap text-white">AUXXIO</span> */}
          </a>
          <div class="flex md:order-2">
            <button type="button" class="text-black bg-[#FFFFFF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-10 py-2.5 text-center mr-3 md:mr-0 z-[20]" onClick={() => connectWallet()}>{walletstring}</button>
            {/* <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </button> */}
          </div>
          <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul class="z-[10] ml-64 flex flex-col p-4 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
              <li>
                <a href="https://auxx.io/whitepaper-auxxio/" class="block py-2 pl-3 pr-4 text-white hover:text-gray-300">Whitepaper</a>
              </li>
              <li>
                <a href="https://auxx.io/" class="block py-2 pl-3 pr-4 text-white hover:text-gray-300">Auxx.IO</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ToastContainer></ToastContainer>

      <div className='sm:hidden block'>

        <div className='w-full bg-[#00043D]  text-white'>
          <div className='mx-[5%]'>
            <div className='text-[40px] pb-6'>Welcome to our
              Mint Platform.
              Get a piece of Auxxio</div>
            <div className='text-[18px] pb-6'>Don't miss out on this opportunity to own a piece of digital real estate and be a part of shaping the future of digital assets. Stay tuned for more posts in this series and visit our website to learn more! #Auxxio #AuxxLandNFT #digitalassets #NFTs #blockchain #art #investment #metaverse #futuretech</div>
          </div>
        </div>

        <div className='flex bg-[#00043D] pt-6'>
          <img className='m-auto w-[80%]' src={image5} alt="img" id="up"></img>
        </div>

        <div className='flex bg-[#00043D] mt-[-40px]'>

          <div className='w-[250px] mx-auto bg-[#252735] text-center py-6'>
            <div className='text-[#ffffff] text-[24px] font-bold'>Mint for</div>
            <div className='text-[#A967FF] text-[32px] font-bold'>1 BNB</div>
            <div className='flex mt-3'>
              <input type="text" className="text-black outline-none px-4 w-[125px]" onChange={handleChange} placeholder="input the nft amount" />
              <button type="button" className="text-black bg-[#FFFFFF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm flex justify-center py-2.5 text-center border-l-2 border-l-black w-[125px] h-[50px] items-center" onClick={() => Mint()} >MINT AUXXLAND</button>
            </div>
          </div>
        </div>

        <div className='flex bg-[#00043D] py-6'>
          <button type="button" class="mx-auto w-[80%] text-white border-white border-[1px] bg-[#00043D] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center">{numOfMinted}/100 NFT MINTED</button>
        </div>

        <div className='flex bg-[#00043D]'>
          <a className='mx-auto' href='https://auxx.io/whitepaper-auxxio/'>
            <button type="button" class="text-white bg-[#A967FF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center">READ THE WHITEPAPER</button>
          </a>
        </div>

        <div className='flex bg-[#00043D] pt-6'>
          <a className='mx-auto' href='https://t.co/5m9RHL58up'>
            <button type="button" class=" text-white border-white border-[1px] bg-[#00043D] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center">JOIN DISCORD</button>
          </a>
        </div>

        <div className='text-[40px] text-center bg-[#00043D] tracking-[.1em] font-["Red Rose"] text-[#00043D]' style={txtol}>AUXXIO NFT</div>

        <div className='w-full h-fit bg-[#00043D] flex text-white py-[50px] relative z-[20]'>
          <div className='w-full px-[10%]'>
            <div>Benefits</div>
            <div className='text-[32px] text-center'>WHY MINT AUXX-LAND ?</div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Get rewarded with revenue shares</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Get a vote right in the future DAO</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Own an unique Metaverse venue</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Get access to Beta and Extra Features</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Support Art and the Artists</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Participate in exclusive giveaway/airdrops</div>
            </div>
          </div>
        </div>

        <div className='flex bg-[#00043D]'>
          <img className='m-auto w-[80%]' src={image81} alt="img"></img>
        </div>
        <div className='text-white bg-[#00043D] py-6 px-4 text-center'>
          <div className='text-[32px] mt-6'>What are AUXX LANDS ?</div>
          <div className='text-[18px] text-center'>In the forthcoming Auxxio metaverse, owning a piece of land will grant you the opportunity to showcase and sell assets located on your property, while allowing you to personalize the space to your liking and display advertisements.</div>
          <div className='text-[32px] mt-6'>What are my benefits ?</div>
          <div className='text-[18px] text-center'>By owning an Auxxio NFT, you may have the opportunity to access exclusive features and services, such as airdrops, beta access and many more. This will allow you to get the most out of your investment and stay ahead of the game.</div>
          <div className='text-[#D9D9D9] mt-6 text-center'>Owning an Auxx Land NFT provides a unique opportunity to actively participate in the future of Auxxio's governance by granting its owners the ability to vote and have a say in the decision-making process of our DAO.</div>
          <div className='mt-6 text-center'>By owning an Auxx Land, you support the development of the digital art market, helping to promote and preserve the world's cultural heritage for future generations.</div>
        </div>
        <div className='flex bg-[#00043D]'>
          <button type="button" class="m-auto w-[80%] text-black bg-[#FFFFFF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center " onClick={handleUP}>MINT AUXXLAND</button>
        </div>

        <div className='flex bg-[#00043D] pt-6'>
          <img className='m-auto w-[100%]' src={image6} alt="img"></img>
        </div>

        <div className='bg-[#00043D] block'>
          <div className='text-white text-center text-[25px]'>Never Miss A Drop</div>
          <div className='flex relative'>
            <input className='w-full mt-[10px] text-[18px] text-center focus:outline-none text-[#9C9A9B] bg-[#00043D] border-b-2 border-[#9C9A9B]' placeholder='Email Address' id='email1'></input>

          </div>
        </div>

        <div className='flex bg-[#00043D] py-6'>
          <button type="button" class="m-auto text-black bg-[#FFFFFF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center " onClick={() => submitemail('email1')}>SUBMIT</button>
        </div>

        <div className='flex bg-[#00043D]'>
          <img className='m-auto w-[80%]' src={image9} alt="img"></img>
        </div>

        <div className='flex bg-[#00043D] py-6'>
          <div className='mx-auto w-[60%] flex'>
            <div className='mx-auto'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#A967FF" class="bi bi-facebook" viewBox="0 0 16 16">
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
            </svg></div>

            <div className='mx-auto'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#A967FF" class="bi bi-twitter" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg></div>


            <div className='mx-auto'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#A967FF" class="bi bi-instagram" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
            </svg></div>


          </div>
        </div>

        <div className='flex bg-[#00043D] pt-6'>
          <div className='mx-auto w-[60%] flex'>
            <div className='w-[40%] m-auto'>
              <div className='text-white my-3'>Discover</div>
              <a href='https://t.me/auxxio'>
                <div className='text-[#9C9A9B] my-3'>Community</div></a>
              <a href='https://auxx.io/'>
                <div className='text-[#9C9A9B] my-3'>Website</div></a>
              <a href='https://auxx.io/team'>
                <div className='text-[#9C9A9B] my-3'>The Team</div></a>
              <a href='https://twitter.com/Auxx_io'>
                <div className='text-[#9C9A9B] my-3'>Join Twitter</div></a>
              <a href='https://t.co/5m9RHL58up'>
                <div className='text-[#9C9A9B] my-3'>Join Discord</div></a>
            </div>
            <div className='w-[40%] m-auto'>
              <div className='text-white my-3'>Social</div>
              <a href='https://www.instagram.com/auxx_io/'>
                <div className='text-[#9C9A9B] my-3'>Instagram</div></a>
              <a href='https://www.youtube.com/channel/UCrUJ9IKrZ8GvS8xvwMi7jvg'>
                <div className='text-[#9C9A9B] my-3'>Youtube</div></a>
              <a href='https://www.tiktok.com/@auxx_io'>
                <div className='text-[#9C9A9B] my-3'>Tiktok</div></a>
              <a href='https://www.facebook.com/auxxioart/'>

                <div className='text-[#9C9A9B] my-3'>Facebook</div>
              </a>
              <a href='https://auxxio.medium.com/'>
                <div className='text-[#9C9A9B] my-3'>Medium</div></a>
            </div>
          </div>
        </div>

        <div className='text-center text-white bg-[#00043D] pt-6 pb-6'>
          <div>Mentions Légales</div>
        </div>

      </div>

      <div className='sm:block hidden'>

        <div className='w-full h-fit bg-[#00043D] flex text-white pt-[100px]'>

          <div className='w-1/2'>
            <div className='mx-[20%]'>
              <div className='text-[56px]'>Welcome to our
                Mint Platform.
                Get a piece of Auxxio</div>
              <div className='text-[18px]'>Don't miss out on this opportunity to own a piece of digital real estate and be a part of shaping the future of digital assets. Stay tuned for more posts in this series and visit our website to learn more! #Auxxio #AuxxLandNFT #digitalassets #NFTs #blockchain #art #investment #metaverse #futuretech</div>
              <div className='my-6 flex '>
                <input type="text" className="text-black outline-none px-4 w-[200px]" onChange={handleChange} placeholder="input the nft amount" />
                <button type="button" className="text-black bg-[#FFFFFF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-10 py-2.5 text-center mr-3 md:mr-0 border-l-2 border-l-black" onClick={() => Mint()} >MINT AUXXLAND</button>
                {/* <a href='https://t.co/5m9RHL58up'>
                  <button type="button" class="text-white border-white border-[1px] bg-[#00043D] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center mr-3 ml-3 md:mr-0">JOIN DISCORD</button>
                </a> */}
              </div>
            </div>
          </div>

          <div className='w-1/2'>
            <div className='absolute w-[40%] h-[576px] right-[10%] top-[-201px] border-[2px] border-[#9901D5] rotate-[-0.96deg]'></div>
            <div className='absolute w-[40%] h-[576px] right-[10%] top-[-201px] border-[2px] border-[#9901D5] rotate-[-11.4deg]'></div>
            <div className='absolute w-[40%] h-[576px] right-[10%] top-[-201px] border-[2px] border-[#9901D5] rotate-[-19.58deg]'></div>
            <div className='absolute w-[40%] h-[576px] right-[10%] top-[-201px] border-[2px] border-[#9901D5] rotate-[-29.67deg]'></div>

            <div className='flex'>
              <div className='z-[1] m-auto px-4'>
                <img src={image5} alt="img"></img>
                <div className='my-6 flex'>
                  <button type="button" class="text-white border-white border-[1px] bg-[#00043D] focus:outline-none font-medium text-sm px-5 py-2.5 text-center mx-auto">{numOfMinted}/100 NFT MINTED</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full h-fit bg-[#00043D] flex text-white pt-[200px]'>
          <div className='w-1/2'>
            <div className='flex'>
              <div className='w-[240px] h-[360px] bg-[#B308F7] blur-[147px] absolute left-[25%]'></div>
              <div className='m-auto z-10'>
                <img src={image6} className='' alt="img"></img>
                {/* <div className='my-6 flex'>
                  <button type="button" class="text-white border-white border-[1px] bg-[#00043D] focus:outline-none font-medium text-sm px-5 py-2.5 text-center mx-auto">0/100 NFT MINTED</button>
                </div> */}
              </div>
            </div>
          </div>
          <div className='w-1/2 mt-[-200px]'>
            <div className='text-[100px] tracking-[.1em] font-["Red Rose"] text-[#00043D]' style={txtol}>AUXXIO NFT</div>
            <div>Maître Pascal, Carcassonne</div>
            <div className='text-[32px]'>What are the “rewards” ?</div>
            <div className='text-[18px] w-[80%]'>As a land owner, you will receive a share of the revenue generated by sales of our partners on the Auxxio platform, which can include artworks, collectible items, and unique physical objects.</div>
            <div className='text-[32px] mt-6'>What are AUXX LANDS ?</div>
            <div className='text-[18px] w-[80%]'>In the forthcoming Auxxio metaverse, owning a piece of land will grant you the opportunity to showcase and sell assets located on your property, while allowing you to personalize the space to your liking and display advertisements.</div>
            <div className='text-[32px] mt-6'>What are my benefits ?</div>
            <div className='text-[18px] w-[80%]'>By owning an Auxxio NFT, you may have the opportunity to access exclusive features and services, such as airdrops, beta access and many more. This will allow you to get the most out of your investment and stay ahead of the game.</div>
          </div>
        </div>

        <div className='w-full h-fit bg-[#00043D] flex text-white pt-[200px] relative z-[20]'>
          <div className='w-1/2 pl-[15%]'>
            <div>Benefits</div>
            <div className='text-[32px]'>WHY MINT AUXX-LAND ?</div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Get rewarded with revenue shares</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Get a vote right in the future DAO</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Own an unique Metaverse venue</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Get access to Beta and Extra Features</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Support Art and the Artists</div>
            </div>
            <div className='flex'>
              <div className='text-[40px] text-[#9901D5]'>*
              </div>
              <div className='pt-[10px] pl-[10px] text-[20px]'>
                Participate in exclusive giveaway/airdrops</div>
            </div>
          </div>
          <div className='w-1/2 pr-[15%] text-[18px] tracking-[.1em] z-[50]'>
            <div className='text-[#D9D9D9]'>Owning an Auxx Land NFT provides a unique opportunity to actively participate in the future of Auxxio's governance by granting its owners the ability to vote and have a say in the decision-making process of our DAO.</div>
            <div className='mt-6'>By owning an Auxx Land, you support the development of the digital art market, helping to promote and preserve the world's cultural heritage for future generations.</div>
            <img className='mt-[100px] pl-[60%] mr-[-10vw]' src={image7} alt="img"></img>
          </div>
        </div>

        <div className='w-full h-fit bg-[#00043D] flex text-white py-[200px] relative z-[20]'>
          <div className='w-1/2 pl-[15%]'>
            <div className='w-[80%] text-black  text-lg'>
              <button type="button" class="bg-[#FFFFFF] my-3 w-full  text-left font-medium px-5 py-3  mr-3 md:mr-0">1. Get MetaMask</button>

              <button type="button" class="bg-[#FFFFFF] my-3  w-full text-left font-medium px-5 py-3  mr-3 md:mr-0">2. Have Some BNB</button>

              <button type="button" class="bg-[#FFFFFF] my-3  w-full text-left font-medium px-5 py-3  mr-3 md:mr-0">3. Mint Some AUXXLAND</button>
            </div>
          </div>
          <div className='absolute w-[70%] h-[650px] right-[-20%] left-[60%] top-[-300px] border-[2px] border-[#9901D5] rounded-[50%]'></div>
          <div className='absolute w-[70%] h-[650px] right-[-20%] left-[60%] top-[-350px] border-[2px] border-[#9901D5] rounded-[50%]'></div>
          <div className='absolute w-[70%] h-[650px] right-[-20%] left-[60%] top-[-400px] border-[2px] border-[#9901D5] rounded-[50%]'></div>
          <div className='w-1/2 z-[20]'>
            <img className='m-auto' src={image8} alt="img"></img>
            <div className='flex'>
              <button type="button" class="m-auto text-black bg-[#FFFFFF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 mt-6 text-center " onClick={handleUP}>MINT AUXXLAND</button>
            </div>
          </div>
        </div>
        <div className='w-full h-fit bg-[#00043D] flex text-white pt-[200px] pb-12 relative'>
          <img src={image9} className='ml-[5%]' alt="img"></img>
          <div className='ml-[5%] block text-center w-[40vw]'>
            <div className='text-[36px]'>Never Miss A Drop</div>
            <div className='text-[18px] text-[#9C9A9B]'>Join our newsletter to get her latest update!</div>
            <input className='mt-32 pb-2 w-full focus:outline-none text-center text-[18px] text-[#9C9A9B] bg-[#00043D] border-b-2 border-[#9C9A9B]' placeholder='Enter Your Email Address Here' id='email2'></input>
            <button type="button" class="text-black bg-[#FFFFFF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center mt-12 mr-3 md:mr-0" onClick={() => submitemail('email2')}>SUBMIT</button>
            <div className='absolute right-[100px]'>Mentions Légales</div>
          </div>
          <div className='absolute w-[70%] h-[650px] right-[-30%] left-[70%] top-[-550px] border-[2px] border-[#9901D5]'></div>
          <div className='absolute w-[70%] h-[650px] right-[-30%] left-[70%] top-[-550px] border-[2px] border-[#9901D5]  rotate-[-10.44deg]'></div>
          <div className='absolute w-[70%] h-[650px] right-[-30%] left-[70%] top-[-550px] border-[2px] border-[#9901D5]  rotate-[-18.61deg]'></div>
          <div className='absolute w-[70%] h-[650px] right-[-30%] left-[70%] top-[-550px] border-[2px] border-[#9901D5]  rotate-[-28.71deg]'></div>

        </div>
        <div className='w-full h-fit bg-[#000000] flex text-white py-[100px]'>
          <div className='ml-[5%] block'>
            <div className='text-[32px]'>AUXXIO</div>
            <div className='text-[16px] text-[#9C9A9B]'>Certified NFT Auction Platform</div>
          </div>
          <div className='ml-[10%] block'>
            <div>Discover</div>
            <a href='https://auxx.io/whitepaper-auxxio/'>
              <div className='text-[#9C9A9B] my-3'>Whitepaper</div></a>
            <a href='https://auxx.io/'>
              <div className='text-[#9C9A9B] my-3'>Website</div></a>
            <a href='https://t.me/auxxio'>
              <div className='text-[#9C9A9B] my-3'>The Team</div></a>
          </div>
          <div className='ml-[10%] block'>
            <div>Community</div>
            <a href='https://t.co/5m9RHL58up'>
              <div className='text-[#9C9A9B] my-3'>Join Discord</div></a>
            <a href='https://twitter.com/Auxx_io'>
              <div className='text-[#9C9A9B] my-3'>Join Twitter</div></a>
            <a href='https://www.instagram.com/auxx_io/'>
              <div className='text-[#9C9A9B] my-3'>Instagram</div></a>

          </div>
          <div className='ml-[10%] block'>
            <a href='https://auxxio.medium.com/'>
              <div>Medium</div></a>
            <a href='https://www.youtube.com/channel/UCrUJ9IKrZ8GvS8xvwMi7jvg'>
              <div className='text-[#9C9A9B] my-3'>Youtube</div></a>
            <a href='https://www.tiktok.com/@auxx_io'>
              <div className='text-[#9C9A9B] my-3'>Tiktok</div></a>
            <a href='https://www.facebook.com/auxxioart/'>
              <div className='text-[#9C9A9B] my-3'>Facebook</div></a>
          </div>
          <div className='ml-[10%] block'>
            <div>Never Miss Auxxio</div>
            <div className='flex relative'>
              <input className='w-full mt-[10px] focus:outline-none text-[#9C9A9B] bg-[#000000] border-b-2 border-[#9C9A9B]' placeholder='Email Address'></input>
              <button type="button" class="text-white absolute right-[0px] top-[15px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                </svg>
              </button>

            </div>
          </div>
        </div>


      </div>


    </div>
  );
}

export default App;
