// Former version of create component. No longer supported after added the new features to suppor latest version of thirdweb.
import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import {
  useAddress,
  useContract,
  MediaRenderer, //This is used to show images (like an img tag)
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import {
  ChainId,
  NFT,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

type Props = {};

function Create({}: Props) {
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const address = useAddress();
  const router = useRouter();
  //We need to make a connection with the marketplace of our contract
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  //Print the contract
  console.log("The contract>>>", contract);

  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT,
    "nft-collection"
  );
  //Print the nft collection contract
  console.log("The collection contract>>>", collectionContract);

  //If we are not logged in, then we can not access the nfts since the address will be undefined
  const ownedNfts = useOwnedNFTs(collectionContract, address);
  //Print the ownedNfts
  console.log("Owned nfts:>>>", ownedNfts);

  const networkMismatch = useNetworkMismatch();

  //We don't need the first argument so that we do not include
  //(just leave a blank space before the comma)
  //If we only need the second argument in an array destruturing then we just put
  //a comma, and then we name the second argument
  const [, switchNetwork] = useNetwork();

  const {
    // here we rename the 'mutate' returned variable by 'createDirectListing'
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  const {
    //Here, we rename the block scope variables isLoading and error
    // so that thy will not conflict with the previous variables
    // defined with useCreateDirectListing
    mutate: createAuctiontListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(contract);

  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // First of all we're going to check whether the user is in the right network.
    //If the user is not in the correct network then switch to the right network
    if (networkMismatch) {
      //Here, network is defined in utils/network.ts as ChainId.Mumbai
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selectedNft) return;

    //TYPESCRIPT: Here, we are extending the e.target type with '&' operator
    //by adding the elements property so that we can use that property later
    // (down bellow)
    const target = e.target as typeof e.target & {
      //Here, value and price are defined in the name properties of the html inputs
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    let toastId = toast.loading("Please wait while preparing the Listing...");

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          //this is the collection address
          //We add an exclamation mark maybe because we are shure that
          //the address is definetively that value (not null)
          assetContractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          //This is an address that resembles matic
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, //1 WEEK
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          //the options to return
          onSuccess(data, variables, context) {
            console.log("SUCCESS:>>", data, variables, context);
            toast.dismiss(toastId);
            toast.success("Listing created!");
            //After success redirect the user to the homescreen
            router.push("/");
          },
          onError(error, variables, context) {
            console.log("ERROR:>>", error, variables, context);
            toast.dismiss(toastId);
            toast.error(
              "ERROR: An error ocurred. It was not possible to create the listing."
            );
            // alert('An error ocurred. It was not possible to create the listing.' + error);
          },
        }
      );
    }
    // IMPORTANT: consider that when we create an option for an nft, then that nft is reserved
    //and will not be available for other auctions or direct listings. However, when we create a
    //direct listing we can create as many direct listings (with different prices) as we want.
    if (listingType.value === "auctionListing") {
      createAuctiontListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
          buyoutPricePerToken: price.value,
          tokenId: selectedNft.metadata.id,
          startTimestamp: new Date(),
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, //7 days.
          quantity: 1,
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log("SUCCESS:>>", data, variables, context);
            toast.dismiss(toastId);
            toast.success("Auction Listing created");
            router.push("/");
          },
          onError(error, variables, context) {
            console.log(
              "ERROR while creating the action listing:>>",
              error,
              variables,
              context
            );
            toast.dismiss(toastId);
            toast.error("ERROR while create the acution listing");
          },
        }
      );
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 pt-2">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item you would like to Sell
        </h2>
        <hr className="mb-5" />
        <p>Bellow you'll find the NFTs you own in your wallet</p>
        <div
          // className='grid sm:grid-cols-2 md:grid-cols-3 space-x-4 space-y-4'
          className="flex overflow-x-scroll space-x-2"
        >
          {ownedNfts?.data?.map((nft) => (
            <div
              className={`flex flex-col space-y-5 card min-w-fit 
                            border-2 bg-gray-100 
                            ${
                              nft.metadata.id === selectedNft?.metadata.id
                                ? "border-black"
                                : "border-transparent"
                            }`}
              key={nft.metadata.id}
              onClick={() => {
                setSelectedNft(nft);
                console.log("The selected nft type>>>", nft);
              }}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={nft.metadata.image}
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-xs  truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>
        {/* Show this area only if selectedNft is defined */}
        {selectedNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                {/* Here, we gruop the radio buttons by assigning the same name 'listingType' 
                                to each one of them so that only one radio can be selected. */}
                <label className="border-r font-light" htmlFor="">
                  Direct Listing / Fixed Price
                </label>
                <input
                  type="radio"
                  name="listingType"
                  value="directListing"
                  className="ml-auto h-10 w-10"
                />

                <label className="border-r font-light" htmlFor="">
                  Auction
                </label>
                <input
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                  className="ml-auto h-10 w-10"
                />

                <label className="border-r font-li" htmlFor="">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  placeholder="0.05"
                  className="bg-gray-100 p-5"
                />
              </div>
              <button
                className="bg-blue-600 text-white rounded-lg p-4 mt-8"
                // This is gonna trigger the form's submit function
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
      <div>
        <Toaster />
      </div>
    </div>
  );
}

export default Create;
