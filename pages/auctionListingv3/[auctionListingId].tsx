//Here, we are naming the file with square brackets [] because the square brackets
//resemble a wild card, which means that we can actually access this way:
// /listing/[anyValue]
// IMPORTANT: For more info about using dynamic routes head over to:
// https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
import {
  useContract,
  useNetwork,
  useNetworkMismatch,
  MediaRenderer,
  useAddress,
  useBuyDirectListing,
  useEnglishAuction,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { EnglishAuction } from "@thirdweb-dev/sdk";
import { stringify } from "querystring";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { ListingTypeE } from "../../typings.d";

function ListingPage() {
  const router = useRouter();
  //Obtain the address of the connected wallet
  const address = useAddress();
  //Obtain the listingId from the router query which can be accessed by
  console.log("The query>>>", router.query);

  const { auctionListingId } = router.query as {
    auctionListingId: string;
  };

  console.log("the ListingID:>>>", auctionListingId);

  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const [bidAmount, setBidAmount] = useState("");

  //For more details about this hook ussage see create.tsx
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  //Obtain the contract marketplace
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace-v3"
  );

  const {
    mutateAsync: buyDirectListing,
    isLoading: isLoadingBuyDirectListing,
  } = useBuyDirectListing(contract);

  const { data: auctionListing, isLoading: isLoadingAuctionListing } =
    useEnglishAuction(contract, auctionListingId);

  //This useEffect will trigger the first time the component renders
  //and whenever any of the dependency variables changes.
  useEffect(() => {
    if (!auctionListingId || !contract || !auctionListing) return;

    fetchMinNextBid();
  }, [auctionListingId, auctionListing, contract]);

  console.log("The minimum next bid>>>", minimumNextBid);

  const fetchMinNextBid = async () => {
    if (!auctionListingId || !contract || !auctionListing) return;

    const minbidResponse = await contract.englishAuctions.getMinimumNextBid(
      auctionListingId
    );
    console.log("The min>>>", minbidResponse);

    setMinimumNextBid({
      // displayValue: minbidResponse.displayValue,
      displayValue: minbidResponse.displayValue,
      // symbol: minbidResponse.symbol,
      symbol: minbidResponse.symbol,
    });
  };

  const formatPlaceholder = () => {
    // if (!minimumNextBid?.displayValue) return 'Enter Bid Amount';
    //Here, instead of checking whether there are a displayValue (as code commented above),
    //we directly trya to convert the display values to a Number and greater than zero. If it is undefined, then
    return Number(minimumNextBid?.displayValue) === 0
      ? "Enter Bid Amount"
      : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;
  };

  const buyNft = async () => {
    if (networkMismatch) {
      //Switch the network to the propper network in case the
      //user is working in other network
      switchNetwork && switchNetwork(network);
      return;
    }

    //Check whether the required elements are correctly loaded
    if (!auctionListingId || !contract || !auctionListing) return;

    //INitiate a toast loading:
    const toastId = toast.loading("Please wait...");
    let auctionBuyoutReceipt = await contract.englishAuctions
      .buyoutAuction(auctionListingId)
      .then((data) => {
        console.log("Success on buying the english auction>>>", data);
        //Here, we are using the replece calling instead of
        //push('/') because we should close the listing. Therefore,
        //the user won't be able to go back with the back button
        router.replace("/");
        toast.dismiss(toastId);
        toast.success("NFT bought successfully!");
        return data.receipt;
      })
      .catch((error) => {
        console.log("ERROR when trying to buyout the auction: ", error);
        toast.dismiss(toastId);
        toast.error("ERROR: NFT could not be bought");
        return undefined;
      });

    console.log("The recepit>>>", auctionBuyoutReceipt);
  };

  const createBidOrOffer = async () => {
    let toastId = toast.loading("Please wait...");
    // alert('the bid offer' + bidAmount)
    try {
      if (networkMismatch) {
        //Switch the network to the propper network in case the
        //user is working in other network
        switchNetwork && switchNetwork(network);
        return;
      }

      if (!auctionListing || !contract) return;

      console.log("Making Bid...");
      try {
        const txResult = await contract.englishAuctions.makeBid(
          auctionListingId,
          bidAmount
        );
        toast.dismiss(toastId);
        toast.success("Bid made successfully");
        console.log("Bid Success>>>", txResult);
        setBidAmount("");
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("ERROR: Bid could not be made");
        console.log("Error on making the bid>>>", error);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        "An error ocurred when trying to create a bid offer. Please call the administrator"
      );
      // alert('An error ocurred when trying to create a bid offer.')
      console.log("Error when trying to create a bid offer>>>", error);
    }
  };

  if (isLoadingAuctionListing)
    return (
      <div>
        <Header />
        <div className="text-center animate-pulse text-blue-500">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  if (!auctionListing) {
    return <div>Listing not found</div>;
  }

  // if (error) return (<div>{error}</div>);

  return (
    <div>
      <Header />
      <main
        className="max-w-6xl mx-auto p-2 flex flex-col 
            lg:flex-row space-y-10 space-x-5 pr-10"
      >
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          {/* Since we controlled the listing status above with (isLoading and 
                        !isListing conditions)  then there is no need to apply the optional chaining*/}
          <MediaRenderer src={(auctionListing as EnglishAuction).asset.image} />
        </div>
        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{auctionListing.asset.name}</h1>
            <p className="text-gray-600">{auctionListing.asset.description}</p>
            <p className="flex gap-1 items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-semibold pr-1">Seller: </span>
              {auctionListing.creatorAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>{"Auction Listing"}</p>

            <p className="font-bold">Buy it Now Price:</p>
            <p className="text-4xl font-bold">
              {auctionListing.buyoutCurrencyValue.displayValue}{" "}
              {auctionListing.buyoutCurrencyValue.symbol}
            </p>

            <button
              onClick={buyNft}
              className="col-start-2 bg-blue-600 font-bold
                         text-white rounded-full w-44 py-4 px-10 mt-2"
            >
              Buy Now
            </button>
          </div>

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            {/* col-span-2: use the full space (that is the two columns in the grid) */}
            <hr className="col-span-2" />

            {/* TODO: Remaining time on auction goes here */}
            {
              <>
                <p>Current Minimum Bid:</p>
                <p className="font-bold">
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                </p>
                <p>Time Remaining:</p>
                <Countdown
                  date={
                    Number(auctionListing.endTimeInSeconds.toString()) * 1000
                  }
                />
              </>
            }
            <input
              className="border p-2 rounded-lg mr-5 outline-red-500"
              type="text"
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={formatPlaceholder()}
            />
            <button
              className="bg-red-600 hover:bg-red-500 font-bold
                         text-white rounded-full w-44 py-4 p-x10"
              onClick={createBidOrOffer}
            >
              {"Bid"}
            </button>
          </div>
        </section>
      </main>
      <div>
        <Toaster />
      </div>
    </div>
  );
}

export default ListingPage;
