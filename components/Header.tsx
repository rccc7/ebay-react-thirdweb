import React from "react";
import {
  ChainId,
  ConnectWallet,
  useAddress,
  useDisconnect,
  useMetamask,
} from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import ebuy_logo from "../public/images/ebuy_logo.png";
import network from "../utils/network";

type Props = {};

function Header({}: Props) {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    //We use mx-auto in order to center (horizontally) this component.
    <div className="max-w-6xl mx-auto p-2">
      {/* We add the nav section to encapsulate the top portion */}
      <nav className="flex justify-between">
        <div className=" flex items-center space-x-2 text-sm">
          {/* This button will no longer be available because the connectToMetamask hook
           does not work well with the new version of thirdweb */}
          {/* {address ? (
            // Show just the first 5 characters and the last 4 characters with slice
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button
              onClick={() => connectWithMetamask({ chainId: network })}
              className="connectWalletBtn"
            >
              Connect your wallet
            </button>
          )} */}
          {/* Added this component to replace the former button since the connectWithMetamask hook is not working
          properly, and when there is no Metamask extension installed the button simply does not respond.  */}
          <ConnectWallet
            // className="connectWalletBtn"
            dropdownPosition={{ side: "bottom", align: "center" }}
          />
          {/* Note: inline-flex is the same as flex */}
          <p className="headerLink">Daily Deals</p>
          <p className="headerLink">Help & Contact</p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <p className="headerLink">Ship to</p>
          <p className="headerLink">Sell</p>
          <p className="headerLink">Watchlist</p>

          <Link
            className="flex items-center link text-blue-700 bg-blue-100 rounded-md px-1"
            href={"/addItem"}
          >
            Add to inventory
            <ChevronDownIcon className="h-4" />
          </Link>
          <BellIcon className="h-6 w-6" />
          <ShoppingCartIcon className="h-6 w-6" />
        </div>
      </nav>

      <hr className="mt-2" />

      <section className="flex items-center space-x-2 py-5">
        <div className="h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0">
          <Link href="/">
            <Image
              className="h-full w-full object-contain"
              alt="Thirdweb Logo"
              src={ebuy_logo}
              // src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg"
              // attributions='Based in the original ebay logo from https://commons.wikimedia.org/wiki/File:EBay_logo.svg'
              width={100}
              height={100}
            />
          </Link>
        </div>
        <button className="hidden lg:flex items-center space-x-2 w-20">
          <p className="text-gray-600 text-sm">Shop by Category</p>
          <ChevronDownIcon className="h-4 flex-shrink-0" />
        </button>
        {/* flex-1 assures that this element will take the maximun amount of space
				that is the remaining space */}
        <div
          className="flex items-center space-x-2 px-2 md:px-5 py-2 border-black
				border-2 flex-1"
        >
          <MagnifyingGlassIcon className="w-5 text-gray-400 " />
          {/* flex-1: occupy the maximum space (that is the remaining space) */}
          <input
            className="flex-1 outline-none"
            placeholder="Search for Anything"
            type="text"
          />
        </div>
        <button
          className="hidden sm:inline bg-blue-600 text-white px-5 
				md:px-10 py-2 border-2 border-blue-600"
        >
          Search
        </button>
        <Link href="/create">
          <button
            className="border-2 border-blue-600 px-5 md:px-10 py-2
				 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer"
          >
            List Item
          </button>
        </Link>
      </section>
      <hr />
      <section
        className="flex py-3 space-x-6 text-xs md:text-sm 
			whitespace-nowrap justify-center px-6"
      >
        <p className="link">Home</p>
        <p className="link">Electronics</p>
        <p className="link">Computer</p>
        <p className="link hidden sm:inline">Video Games</p>
        <p className="link hidden sm:inline">Home & Garden</p>
        <p className="link hidden md:inline">Health & Beauty</p>
        <p className="link hidden lg:inline">Collectibles and Art</p>
        <p className="link hidden lg:inline">Books</p>
        <p className="link hidden lg:inline">Music</p>
        <p className="link hidden xl:inline">Deals</p>
        <p className="link hidden xl:inline">Other</p>
        <p className="link">More</p>
      </section>
    </div>
  );
}

export default Header;
