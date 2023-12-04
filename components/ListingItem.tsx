import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { MediaRenderer } from "@thirdweb-dev/react";
import { Router, useRouter } from "next/router";
import { ListingItemInfo, ListingTypeE } from "../typings.d";
// import { ListingItemInfo, ListingTypeE } from "../typings";

function ListingItem({
  id,
  name,
  description,
  currencyValuePerToken,
  image,
  currencyValuePerTokenSymbol,
  type,
}: ListingItemInfo) {
  return (
    <div
      // key={id}
      // href={`/listing/${listing.id}`}
      // onClick={() => router.push(`/listing/${listing.id}`)}
      className="flex-col card hover:scale-105 
    transition-all duration-150 ease-out"
    >
      <div className="flex flex-1 flex-col pb-2 items-center">
        <MediaRenderer className="h-44" src={image} />
      </div>
      <div>
        <div className="pt-2 space-y-4">
          <h2 className="text-lg truncate">{name}</h2>
          <hr />
          {/* Truncate if description becomes too lonkg */}
          <p className="truncate text-sm text-gray-700 mt-2">{description}</p>
        </div>
        <p>
          <span className="font-bold">{"" + currencyValuePerToken}</span>
          {" " + currencyValuePerTokenSymbol}
        </p>
        {/* w-fit -> width: fit-content */}
        <div
          className={`flex items-center space-x-1 justify-end 
      text-xs border w-fit ml-auto rounded-lg p-2
       text-white ${
         //  "bg-blue-500"
         //  No longer needed to verify the listing tipe. We already know it's a direct listing
         type === ListingTypeE.DirectListing ? "bg-blue-500" : "bg-red-500"
       }`}
        >
          <p>{type === ListingTypeE.DirectListing ? "Buy Now" : "Auction"}</p>
          <BanknotesIcon className="h-4" />
          {/* {listing.type === ListingType.Direct ? (
      <BanknotesIcon className="h-4" />
    ) : (
      <ClockIcon className="h-4" />
    )} */}
        </div>
      </div>
    </div>
  );
}

export default ListingItem;
