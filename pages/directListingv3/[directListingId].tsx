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
  useDirectListing,
  useBuyDirectListing,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { DirectListingV3, ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
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

  const [enableButton, setEnableButton] = useState<Boolean>(false);

  //Obtain the directListingId from the router query which can be accessed by
  console.log("The query>>>", router.query);

  const { directListingId } = router.query as {
    directListingId: string;
  };

  console.log("the ListingID>>>>", directListingId);

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

  const {
    data: directListing,
    isLoading: isLoadingListing,
    error,
  } = useDirectListing(contract, directListingId);

  if (error) return <p>Error {"" + error}</p>;

  //This useEffect will trigger the first time the component renders
  //and whenever any of the dependency variables changes.
  useEffect(() => {
    if (!directListingId || !contract || !directListing || !address) return;

    console.log("The direct listing>>>", directListing);
    console.log("The addresss>", address);
    setEnableButton(true);
  }, [directListingId, directListing, contract, address]);

  const buyNft = async () => {
    if (networkMismatch) {
      //Switch the network to the propper network in case the
      //user is working in other network
      switchNetwork && switchNetwork(network);
      return;
    }

    //Check whether the required elements are correctly loaded
    if (
      !directListingId ||
      !contract ||
      !directListing ||
      // !buyDirectListing ||
      !address
    )
      return;
    //INitiate a toast loading:
    const toastId = toast.loading("Please wait...");
    await buyDirectListing(
      {
        listingId: directListingId,
        quantity: "1",
        buyer: address,
      },
      //The second argument is a set of actions to be taken based on
      //the results:
      {
        onSuccess(data, variables, context) {
          // alert('NFT bought successfully!');
          console.log("SUCCESS on Buying ", data);
          //Here, we are using the replece calling instead of
          //push('/') because we should close the listing. Therefore,
          //the user won't be able to go back with the back button
          router.replace("/");
          toast.dismiss(toastId);
          toast.success("NFT bought successfully!");
        },
        onError(error, variables, context) {
          // alert('ERROR: NFT could not be bought');
          console.log("ERROR: ", error, variables, context);
          toast.dismiss(toastId);
          toast.error("ERROR: NFT could not be bought");
        },
      }
    );
  };

  if (isLoadingListing)
    return (
      <div>
        <Header />
        <div className="text-center animate-pulse text-blue-500">
          <p>Loading Item...</p>
        </div>
      </div>
    );

  if (!directListing) {
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
          <MediaRenderer src={(directListing as DirectListingV3).asset.image} />
        </div>
        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{directListing.asset.name}</h1>
            <p className="text-gray-600">{directListing.asset.description}</p>
            <p className="flex gap-1 items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-semibold pr-1">Seller: </span>
              {directListing.creatorAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type:</p>
            <p>{"Direct Listing"}</p>

            <p className="font-bold">Buy it Now Price:</p>
            <p className="text-4xl font-bold">
              {directListing.currencyValuePerToken.displayValue}
              {" " /*buyoutCurrencyValuePerToken.displayValue}{" "}*/}
              {directListing.currencyValuePerToken.symbol}{" "}
              {/*buyoutCurrencyValuePerToken.symbol*/}
            </p>

            <button
              onClick={buyNft}
              className={`col-start-2 bg-blue-600 font-bold
                         text-white rounded-full w-44 py-4 px-10 mt-2 ${
                           !enableButton
                             ? "cursor-not-allowed bg-gray-300"
                             : "cursor-pointer bg-blue-600"
                         }`}
            >
              Buy Now
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
