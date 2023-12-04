import { BigNumber } from "ethers";

type ListingItemInfo={
    id:number;
    image:string;
    name:string | number;
    description:string | null | undefined;
    currencyValuePerToken: BigNumber | string;
    currencyValuePerTokenSymbol:string;
    type:ListingTypeE;
}
export enum ListingTypeE{
    DirectListing="DirectListing",
    AuctionListing="AuctionListing",
}