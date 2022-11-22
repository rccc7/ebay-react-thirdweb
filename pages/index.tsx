import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  useActiveListings,
  useContract,
  MediaRenderer
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import Footer from "../components/Footer";
import Header from '../components/Header'

const Home = () => {
  const router = useRouter();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    'marketplace');

  // Obtain the listings from our marketplace
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  console.log(listings)
  return (
    <div className=" ">

      {/* <h1 className='border-gray-400 '>hi there, lets build ebay</h1> */}
      <Header />
      {/* Set the max width of the main to 1152px 
      mx-auto is to center*/}
      <main className="max-w-6xl mx-auto px-6 py-2">
        {
          loadingListings ? (
            <p className="text-center animate-pulse text-blue-500">
              Loading listings...
            </p>
          ) :
            (
              // NOTE: mx-auto is to center
              <div className="grid grid-cols-1 sm:grid-cols-2 
              md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">

                {/* {listings?.map(l => (<p key={l.id}>{l.asset.name}</p>))} */}
                {listings?.map((listing) => (
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
                    // href={`/listing/${listing.id}`}
                    onClick={() => router.push(`/listing/${listing.id}`)}
                    className="flex-col card hover:scale-105 
                    transition-all duration-150 ease-out"
                  >
                    <div className="flex flex-1 flex-col pb-2 items-center">
                      <MediaRenderer className="h-44" src={listing.asset.image} />
                    </div>
                    <div>
                      <div className="pt-2 space-y-4">
                        <h2 className="text-lg truncate">{listing.asset.name}</h2>
                        <hr />
                        {/* Truncate if description becomes too lonkg */}
                        <p className="truncate text-sm text-gray-700 mt-2">
                          {listing.asset.description}
                        </p>
                      </div>
                      <p>
                        <span className="font-bold">
                          {listing.buyoutCurrencyValuePerToken.displayValue}
                        </span>
                        {" " + listing.buyoutCurrencyValuePerToken.symbol}
                      </p>
                      {/* w-fit -> width: fit-content */}
                      <div className={`flex items-center space-x-1 justify-end 
                      text-xs border w-fit ml-auto rounded-lg p-2
                       text-white ${listing.type === ListingType.Direct ? "bg-blue-500" : "bg-red-500"}`}>
                        <p>
                          {listing.type === ListingType.Direct ?
                            "Buy Now"
                            : "Auction"
                          }
                        </p>
                        {listing.type === ListingType.Direct ? (
                          <BanknotesIcon className="h-4" />
                        ) : (
                          <ClockIcon className="h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
        }
      </main>
      <Footer />
    </div>
  )
}

export default Home
