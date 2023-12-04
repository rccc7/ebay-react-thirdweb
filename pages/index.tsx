import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ListingItem from "../components/ListingItem";
import { ListingTypeE } from "../typings.d";

const Home = () => {
  const router = useRouter();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace-v3"
  );

  // Obtain the listings from our marketplace
  const { data: validDirectListings, isLoading: loadingValidDirectListings } =
    useValidDirectListings(contract);

  //Obtain the valid auction listings:
  const { data: validAuctionListings, isLoading: loadingValidAuctionListings } =
    useValidEnglishAuctions(contract);

  console.log("The direct listings>>>", validDirectListings);
  console.log("The auction listings>>>", validAuctionListings);
  return (
    <div className=" ">
      {/* <h1 className='border-gray-400 '>hi there, lets build ebay</h1> */}
      <Header />
      {/* Set the max width of the main to 1152px 
      mx-auto is to center*/}
      <main className="max-w-6xl mx-auto px-6 py-2">
        {loadingValidDirectListings || loadingValidAuctionListings ? (
          <p className="text-center animate-pulse text-blue-500">
            Loading listings...
          </p>
        ) : (!validDirectListings && !validAuctionListings) ||
          (validDirectListings?.length === 0 &&
            validAuctionListings?.length === 0) ? (
          <div>
            <p className="text-center">No listings at the moment....</p>
            <p className="text-center text-sm text-gray-400">
              You can create one by clicking at the{" "}
              <span className="text-blue-500">"List Item"</span> button
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {validDirectListings && validDirectListings.length > 0 && (
              <div className="flex flex-col">
                {/* Direct listings */}
                <p className="text-lg font-semibold pb-2">Direct Listings</p>
                {/* // NOTE: mx-auto is to center */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 
              md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto"
                >
                  {/* {listings?.map(l => (<p key={l.id}>{l.asset.name}</p>))} */}
                  {validDirectListings?.map((listing) => (
                    // In order to dinamically access the listings based on their id,
                    //we'll create a folder "listing" and inside that folder the file
                    //"[listingId].tsx" -->This is the way that we can access dinamically
                    //in Next.js

                    //We'll no longer use the link component. We'll add the onClick
                    //event to the div
                    // <Link
                    //   key={listing.id}
                    //   // href={`/listing/${listing.id}`}
                    // >
                    <div
                      key={listing.id}
                      onClick={() =>
                        router.push(`/directListingv3/${listing.id}`)
                      }
                    >
                      <ListingItem
                        key={listing.id}
                        id={parseInt(listing.id)}
                        currencyValuePerToken={
                          listing.currencyValuePerToken.displayValue
                        }
                        currencyValuePerTokenSymbol={
                          listing.currencyValuePerToken.symbol
                        }
                        description={listing.asset.description}
                        image={listing.asset.image || ""}
                        name={listing.asset.name || ""}
                        type={ListingTypeE.DirectListing}
                      />
                    </div>
                  ))}
                </div>
                <hr className="w-[100%] h-[2px] border-0 bg-gray-200 rounded mx-auto my-4" />
              </div>
            )}
            {validAuctionListings && validAuctionListings.length > 0 && (
              <div className="flex flex-col">
                {/* Auction Listings */}
                <p className="text-lg font-semibold pb-2">Auction Listings</p>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 
              md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto"
                >
                  {validAuctionListings?.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() =>
                        router.push(`/auctionListingv3/${listing.id}`)
                      }
                    >
                      <ListingItem
                        id={parseInt(listing.id)}
                        currencyValuePerToken={
                          listing.buyoutCurrencyValue.displayValue
                        }
                        currencyValuePerTokenSymbol={
                          listing.buyoutCurrencyValue.symbol
                        }
                        description={listing.asset.description}
                        image={listing.asset.image || ""}
                        name={listing.asset.name || ""}
                        type={ListingTypeE.AuctionListing}
                        key={listing.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
