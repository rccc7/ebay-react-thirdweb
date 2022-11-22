//Here, we are naming the file with square brackets [] because the square brackets
//resemble a wild card, which means that we can actually access this way:
// /listing/[anyValue]
// import { MediaRenderer, useContract, useListing } from '@thirdweb-dev/react';
import {
    useContract,
    useNetwork,
    useNetworkMismatch,
    useMakeBid,
    useOffers,
    useMakeOffer,
    useBuyNow,
    MediaRenderer,
    useAddress,
    useListing,
    useAcceptDirectListingOffer,
} from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { ListingType, NATIVE_TOKENS } from '@thirdweb-dev/sdk';
import { stringify } from 'querystring';
import Countdown from 'react-countdown'
import network from '../../utils/network';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';


function ListingPage() {
    const router = useRouter();
    //Obtain the address of the connected wallet
    const address = useAddress();
    //Obtain the listingId from the router query which can be accessed by
    //the name of this file [listingId]
    const { listingId } = router.query as { listingId: string };
    // console.log('The router query>>>', router.query)

    const [minimumNextBid, setMinimumNextBid] = useState<{
        displayValue: string;
        symbol: string;
    }>();

    const [bidAmount, setBidAmount] = useState('');

    //For more details about this hook ussage see create.tsx
    const [, switchNetwork] = useNetwork();
    const networkMismatch = useNetworkMismatch();

    //Obtain the contract marketplace
    const { contract } = useContract(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        'marketplace'
    );

    //Initiate the useMakeBid hook:
    const {
        mutate: makeBid,
        //the following two variables are not needed so we comment them.
        // isLoading,
        // error,
    } = useMakeBid(contract);

    //Initiate the useOffers hook
    const {
        data: offers,
        //Here, we won't need isLoading nor error
        // isLoading: isLoadingOffers,
        // error: errorOffers 
    } =
        useOffers(contract, listingId);

    console.log('the offers>>', offers);

    //Initiate the makeOfer hook
    const {
        mutate: makeOffer,
        // isLoading, //We don't need isLoading
        // error, //we don't need error
    } = useMakeOffer(contract);

    //Initiate the buyNow hook for buying now functionality
    const {
        mutate: buyNow,
        isLoading: isBuyNowLoading,
        error: buyNowError,
    } = useBuyNow(contract);

    //Obtain the listing from the just retrieved listingId and  contract
    const { data: listing, isLoading, error } =
        useListing(contract, listingId);

    const {
        mutate: acceptOffer,
        // isLoading,
        // error,
    } = useAcceptDirectListingOffer(contract);

    //This useEffect will trigger the first time the component renders
    //and whenever any of the dependency variables changes.
    useEffect(() => {
        if (!listingId || !contract || !listing) return;

        if (listing.type === ListingType.Auction) {
            fetchMinNextBid();
        }
    }, [listingId, listing, contract]);

    console.log('The minimum next bid>>>', minimumNextBid)

    const fetchMinNextBid = async () => {
        if (!listingId || !contract || !listing) return;

        const minbidResponse = await contract.auction.getMinimumNextBid(listingId);
        //👆🏻👆🏻👆🏻The above calling can also be destructured as:
        //const {displayValue, symbol} = await contract.auction.getMinimumNextBid(listingId);

        setMinimumNextBid({
            displayValue: minbidResponse.displayValue,
            symbol: minbidResponse.symbol,
        });

    }

    const formatPlaceholder = () => {
        if (!listing) return;
        if (listing.type === ListingType.Direct)
            return 'Enter Offer Amount';

        if (listing.type === ListingType.Auction) {
            // if (!minimumNextBid?.displayValue) return 'Enter Bid Amount';
            //Here, instead of checking whether there are a displayValue (as code commented above),
            //we directly trya to convert the display values to a Number and greater than zero. If it is undefined, then 
            return Number(minimumNextBid?.displayValue) === 0 ?
                'Enter Bid Amount'
                : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`


            // return 'Enter Bid Amount';

            //Improve bid amount
        }

    }

    const buyNft = async () => {
        if (networkMismatch) {
            //Switch the network to the propper network in case the 
            //user is working in other network 
            switchNetwork && switchNetwork(network);
            return;
        }

        //Check whether the required elements are correctly loaded
        if (!listingId || !contract || !listing || !buyNow) return;
        //INitiate a toast loading:
        const toastId = toast.loading('Please wait...');
        await buyNow({
            id: listingId,
            buyAmount: 1,
            type: listing.type,
        },
            //The second argument is a set of actions to be taken based on 
            //the results:
            {
                onSuccess(data, variables, context) {
                    // alert('NFT bought successfully!');
                    console.log('SUCCESS on Buying ', data);
                    //Here, we are using the replece calling instead of
                    //push('/') because we should close the listing. Therefore,
                    //the user won't be able to go back with the back button
                    router.replace('/');
                    toast.dismiss(toastId);
                    toast.success('NFT bought successfully!');
                },
                onError(error, variables, context) {
                    // alert('ERROR: NFT could not be bought');
                    console.log('ERROR: ', error, variables, context);
                    toast.dismiss(toastId);
                    toast.error('ERROR: NFT could not be bought');
                },
            });
        // buyNft().
    }

    const createBidOrOffer = async () => {
        let toastId = toast.loading('Please wait...');
        // alert('the bid offer' + bidAmount)
        try {
            if (networkMismatch) {
                //Switch the network to the propper network in case the
                //user is working in other network 
                switchNetwork && switchNetwork(network);
                return;
            }
            //Direct Listing
            if (listing?.type === ListingType.Direct) {
                //Compare the buyoutPrice with the bidAmount. If they are equal, then turn
                //the transaction to a direct purchase, that is: buyNft
                //Here, ethers parser stands not only for ethers, but also for mumbai, polygon
                //or whhichever network we are using
                if (listing.buyoutPrice.toString() ===
                    ethers.utils.parseEther(bidAmount).toString()) {
                    console.log('Buyout Price met, buying NFT...');
                    buyNft();
                    return;
                }

                //Make an offer
                console.log('Buyout price not met, making offer...');

                await makeOffer({
                    quantity: 1,
                    listingId,
                    pricePerToken: bidAmount,
                },
                    {
                        //this hook uses tanstack's react-query library:  https://tanstack.com/query/v4/docs/reference/useQuery?from=reactQueryV3&original=https://react-query-v3.tanstack.com/reference/useQuery
                        //that is why have these events: onSuccess, onError, etc.
                        onSuccess(data, variables, context) {
                            // alert('Offer made successfully');
                            console.log('SUCCESS', data, variables, context);
                            //Update the state of the bidAmount:
                            setBidAmount('');
                            toast.dismiss(toastId);
                            toast.success('Offer made successfully!');
                            // router.replace('/');
                        },
                        onError(error, variables, context) {
                            // alert('ERROR: Offer could not be made');
                            console.log('ERROR>', error, variables, context);
                            toast.dismiss(toastId);
                            toast.error('ERROR: Offer culd not be made');
                        },
                    }
                )
            }

            //Auction Listing
            if (listing?.type === ListingType.Auction) {
                console.log("Making Bid...");
                await makeBid({
                    listingId,
                    bid: bidAmount,
                }, {
                    onSuccess(data, variables, context) {
                        // alert('Bid made successfully!');
                        toast.dismiss(toastId);
                        toast.success('Bid made successfully');
                        console.log('BID Success>', data, variables, context);
                        //Update the state of the bidAmount:
                        setBidAmount('');
                    },
                    onError(error, variables, context) {
                        // alert('ERROR: Bid could not be made');
                        toast.dismiss(toastId);
                        toast.error('ERROR: Bid could not be made');
                        console.log('ERROR on making hthe bid', error, variables, context);
                    },
                })
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error('An error ocurred when trying to create a bid offer. Please call the administrator')
            // alert('An error ocurred when trying to create a bid offer.')
            console.log('Error when trying to create a bid offer>>>', error);
        }
    }

    if (isLoading) return <div>
        <Header />
        <div className='text-center animate-pulse text-blue-500'>
            <p >Loading Item...</p>
        </div>
    </div>;

    if (!listing) {
        return <div>Listing not found</div>
    }

    // if (error) return (<div>{error}</div>);

    return (
        <div>
            <Header />
            <main className='max-w-6xl mx-auto p-2 flex flex-col 
            lg:flex-row space-y-10 space-x-5 pr-10'>
                <div className='p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl'>
                    {/* Since we controlled the listing status above with (isLoading and 
                        !isListing conditions)  then there is no need to apply the optional chaining*/}
                    <MediaRenderer src={listing.asset.image} />
                </div>
                <section className='flex-1 space-y-5 pb-20 lg:pb-0'>
                    <div>
                        <h1 className='text-xl font-bold'>{listing.asset.name}</h1>
                        <p className='text-gray-600'>{listing.asset.description}</p>
                        <p className='flex gap-1 items-center text-xs sm:text-base'>
                            <UserCircleIcon className='h-5' />
                            <span className='font-semibold pr-1'>Seller: </span>{listing.sellerAddress}
                        </p>
                    </div>

                    <div className='grid grid-cols-2 items-center py-2'>
                        <p className='font-bold'>Listing Type:</p>
                        <p>{listing.type === ListingType.Direct ? 'Direct Listing' : 'Auction Listing'}</p>

                        <p className='font-bold'>Buy it Now Price:</p>
                        <p className='text-4xl font-bold'>
                            {listing.buyoutCurrencyValuePerToken.displayValue}
                            {' '}
                            {listing.buyoutCurrencyValuePerToken.symbol}
                        </p>

                        <button
                            onClick={buyNft}
                            className='col-start-2 bg-blue-600 font-bold
                         text-white rounded-full w-44 py-4 px-10 mt-2'>
                            Buy Now
                        </button>
                    </div>
                    {/* TODO: If Direct, show offers here... */}
                    {listing.type === ListingType.Direct && offers && (
                        <div className='grid grid-cols-2 gap-y-2'>
                            <p className='font-bold'>Offers: </p>
                            <p className='font-bold'>
                                {offers.length > 0 ? offers.length : 0}
                            </p>


                            {offers.map((offer) => (
                                <>
                                    <p className='flex items-center ml-5 text-sm italic'>
                                        <UserCircleIcon className='h-3 mr-2' />
                                        {offer.offeror.slice(0, 5) +
                                            "..." +
                                            offer.offeror.slice(-5)}
                                    </p>
                                    <div>
                                        <p
                                            // Here, we assign the key as a combination of different values 
                                            key={offer.listingId + offer.offeror + offer.totalOfferAmount.toString()}
                                            className='text-sm italic'
                                        >
                                            {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                                            {/* Here, we obtain the symbol of the current 
                                            network to display along with the offer amount */}
                                            {NATIVE_TOKENS[network].symbol}
                                        </p>
                                        {/* Only if the logged user onws the NFT, the button to accept the offering will be visible. */}
                                        {listing.sellerAddress === address && (
                                            <button
                                                onClick={() => {
                                                    acceptOffer({
                                                        listingId,
                                                        addressOfOfferor: offer.offeror,
                                                    },
                                                        {
                                                            onSuccess(data, variables, context) {
                                                                alert("Offer accepted successfuly!");
                                                                console.log('Offer Accepted>', data, variables, context);
                                                                router.replace('/');
                                                            },
                                                            onError(error, variables, context) {
                                                                alert('Error: Offer could not be accepted');
                                                                console.log('Error Offer not accepted ', error, variables, context);
                                                            },
                                                        }
                                                    );
                                                }}
                                                className='p-2 w-32 bg-red-500/50 rounded-lg font-bold text-xs cursor-pointer'
                                            >
                                                Accept Offer
                                            </button>
                                        )}
                                    </div>
                                </>
                            ))}
                        </div>
                    )}

                    <div className='grid grid-cols-2 space-y-2 items-center justify-end'>
                        {/* col-span-2: use the full space (that is the two columns in the grid) */}
                        <hr className='col-span-2' />
                        <p className='col-span-2 font-bold'>
                            {listing.type === ListingType.Direct
                                ? "Make an Offer"
                                : "Bid on this Auction"}
                        </p>
                        {/* TODO: Remaining time on auction goes here */}
                        {listing.type === ListingType.Auction && (
                            <>
                                <p>Current Minimum Bid:</p>
                                <p className='font-bold'>
                                    {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                                </p>
                                <p>Time Remaining:</p>
                                <Countdown date={Number(listing.endTimeInEpochSeconds.toString()) * 1000} />
                            </>
                        )}
                        <input className='border p-2 rounded-lg mr-5 outline-red-500'
                            type="text"
                            onChange={e => setBidAmount(e.target.value)}
                            placeholder={formatPlaceholder()} />
                        <button className='bg-red-600 hover:bg-red-500 font-bold
                         text-white rounded-full w-44 py-4 p-x10'
                            onClick={createBidOrOffer}>
                            {listing.type === ListingType.Direct ? "Offer" : "Bid"}
                        </button>
                    </div>
                </section>
            </main>
            <div>
                <Toaster />
            </div>
        </div>
    )
}

export default ListingPage;