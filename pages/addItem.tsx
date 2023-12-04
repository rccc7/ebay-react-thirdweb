import React, { FormEvent, useState } from "react";
import Header from "../components/Header";
import {
  useAddress,
  useContract,
  useContractWrite,
  useMintNFT,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

type Props = {};

function AddItem({}: Props) {
  //get the logged in user:
  const address = useAddress();

  const router = useRouter();

  const [preview, setPreview] = useState<string>("");
  const [image, setImage] = useState<File>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT,
    "nft-collection"
  );

  const [enableMintButton, setEnableMintButton] = useState<boolean>(true);

  // New hook to mint the contract.
  const { mutateAsync: mintTo, isLoading } = useContractWrite(
    contract,
    "mintTo"
  );

  // Another way to mint using useMintNft hook.
  const {
    mutateAsync: mintNftMutate,
    isLoading: isLoadingNft,
    error: mintNftError,
  } = useMintNFT(contract);

  // 20231014: This is the replacement to the original mintNft function updated with the new useMintNFT hook
  // For more info head over to the "ERC721Mintable" section  at:
  // https://thirdweb.com/mumbai/0xD2C6c020CbE786827c5C9F14Ca955603f844a584/code?environment=react
  //   then expand the "Mint an NFT to a specific wallet" option.
  // For a more detailed example: https://blog.thirdweb.com/guides/mint-nft-using-nextjs/
  const mintNftV3 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) {
      alert("No contract or address availalbe. Please login first");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    // TYPESCRIPT: Here, we obtain the target value and with the '&' operator
    // we are extending the type definition by adding a name
    // and a description (which are taken from the input fields)
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    //Define the metadata for the minting process
    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image, //image URL or a file
    };

    let toastId = toast.loading("Adding item...");
    setEnableMintButton(false);

    await mintNftMutate({ metadata: metadata, to: address || "" })
      .then(() => {
        console.log("Minted!!!");
        toast.dismiss(toastId);
        toast.success("Item added sucessfully!");
        //Now redirect the user back to the homepage once the transaction is done.
        router.push("/");
      })
      .catch((error) => {
        console.log("An error ocurred when trying to mintNFT:>>>", error);
        toast.dismiss(toastId);
        toast.error("Item not added");
        setEnableMintButton(true);
      });
  };

  // 20231014: IMPORTANT: CURRENTLY NOT WORKING
  // This is an alternative function using the useContractWrite hook from which we can call
  // the minTo command by passing two args: _to and _uri. However, different tests were done trying to use
  // this method but they didn't work. Unfortunately there is not much documentation that
  // specifies what the uri parameters should be and there is no documentation that explains how to set the
  // metadata info.
  // For more info head over to the "All Functions & Events" section  at:
  // https://thirdweb.com/mumbai/0xD2C6c020CbE786827c5C9F14Ca955603f844a584/code
  //   then click on the write functions and search for mintTo function.
  const mintNftV2 = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) {
      alert("No contract or address availalbe. Please login first");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    if (isLoading) {
      alert("Stil loading...");
      return;
    }

    // TYPESCRIPT: Here, we obtain the target value and with the '&' operator
    // we are extending the type definition by adding a name
    // and a description (which are taken from the input fields)
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    //Define the metadata for the minting process
    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image, //image URL or a file
    };

    // // Update the contract metadata....
    // updateContractMetadata(metadata);

    let toastId = toast.loading("Adding item...");

    try {
      const data = await mintTo({
        args: [address, metadata],
      });

      console.log("the contract address>>>", contract.getAddress());
      toast.dismiss(toastId);
      toast.success("Item added sucessfully!");

      //Now, get a few details of the transaction
      const receipt = data.receipt; //the transaction receipt

      //Once we get these details above we can use them according to our needs
      //for example  store them in the database or displaying them as a confirmation, etc.
      console.log("the transaction data>>>", receipt);

      //Now redirect the user back to the homepage once the transaction is done.
      router.push("/");
    } catch (err) {
      console.log("contract call failure>>>", err);
      toast.dismiss(toastId);
      toast.error("Item not added");
    }
  };

  // Initial version to mint the Nft calling the function mintTo directly from the contract.
  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // alert('hello')
    if (!contract || !address) {
      alert("No contract or address availalbe. Please login first");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    // TYPESCRIPT: Here, we obtain the target value and with the '&' operator
    // we are extending the type definition by adding a name
    // and a description (which are taken from the input fields)
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    //Define the metadata for the minting process
    const metatada = {
      name: target.name.value,
      description: target.description.value,
      image: image, //image URL or a file
    };

    let toastId = toast.loading("Adding item...");

    try {
      //tx: Transaction
      const tx = await contract.mintTo(address, metatada);

      toast.dismiss(toastId);
      toast.success("Item added sucessfully!");

      //Now, get a few details of the transaction
      const receipt = tx.receipt; //the transaction receipt
      const tokenId = tx.id; //the id of the NFT minted
      const nft = await tx.data(); //Optional: Fetch details of the minted NFT

      //Once we get these details above we can use them according to our needs
      //for example  store them in the database or displaying them as a confirmation, etc.
      console.log("the TX data>>>", receipt, tokenId, nft);

      //Now redirect the user back to the homepage once the transaction is done.
      router.push("/");
    } catch (error) {
      console.log("An error ocurred:>>>", error);
      toast.dismiss(toastId);
      toast.error("Item not added");
    }
  };

  return (
    <div>
      <Header />
      {/* mx-auto: Center when the max width has been surpassed */}
      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add an Item to the Marketplace</h1>
        <h2 className="text-xl font-semibold pt-5">Item details</h2>
        <p className="pb-5">
          By adding an item to the marketplace, you'e essentially Minting an NFT
          of the item into your wallet which we can then list for sale!
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-5 pt-10">
          <img
            //If the preview is not set yet, then show a default image
            src={
              preview ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Backpack_%282551%29_-_The_Noun_Project.svg/640px-Backpack_%282551%29_-_The_Noun_Project.svg.png"
            }
            alt="Rémy Médard, CC0, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Backpack_(2551)_-_The_Noun_Project.svg"
            className="border h-80 w-80 object-contain"
          />
          {/* The form is gonna be responsible for holding all of the NFT information 
                    flex-1: is to use the majority of the screen space*/}
          <form
            className="flex flex-col flex-1 p-2 space-y-2 justify-center"
            onSubmit={mintNftV3}
          >
            <label className="font-light" htmlFor="">
              Name of Item
            </label>
            <input
              className="formField"
              placeholder="Name of Item..."
              type="text"
              name="name"
              id="name"
            />
            <label className="font-light" htmlFor="">
              Description
            </label>
            <input
              className="formField"
              placeholder="Enter Description..."
              type="text"
              name="description"
              id="description"
            />
            <label className="font-light" htmlFor="">
              Image of the Item
            </label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  //URL.createObjectURL gives us the URL with which we can show the image
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
              }}
            />
            {/* ml-auto -> margin-left: auto in order to align the item to the left
                        mx-auto -> margin-left: auto; margin-right: auto; --> center the button  */}
            <button
              type="submit"
              className="bg-blue-600 font-bold text-white rounded-full 
                        py-4 px-10 w-56 mt-50 md:mt-auto mx-auto md:ml-auto md:mr-0"
              disabled={!enableMintButton}
            >
              Add/Mint Item
            </button>
          </form>
        </div>
      </main>
      <div>
        <Toaster />
      </div>
    </div>
  );
}

export default AddItem;
