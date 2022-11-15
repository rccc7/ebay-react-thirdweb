import React, { FormEvent, useState } from 'react'
import Header from '../components/Header'
import { useAddress, useContract } from '@thirdweb-dev/react';
import { useRouter } from 'next/router';

type Props = {}

function AddItem({ }: Props) {
    //get the logged in user:
    const address = useAddress();

    const router = useRouter();

    const [preview, setPreview] = useState<string>('');
    const [image, setImage] = useState<File>();

    const { contract } = useContract(
        process.env.NEXT_PUBLIC_NFT_CONTRACT,
        'nft-collection'
    )

    console.log('The contract:>>>', contract);

    const mintNft = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // alert('hello')
        if (!contract || !address) {
            alert('No contract or address availalbe. Please login first')
            return;
        }

        if (!image) {
            alert('Please select an image');
            return;
        }

        // TYPESCRIPT: Here, we obtain the target value and with the '&' operator
        // we are extending the type definition by adding a name 
        // and a description (which are taken from the input fields)
        const target = e.target as typeof e.target & {
            name: { value: string };
            description: { value: string }
        }

        //Define the metadata for the minting process
        const metatada = {
            name: target.name.value,
            description: target.description.value,
            image: image, //image URL or a file
        }

        try {
            //tx: Transaction
            const tx = await contract.mintTo(address, metatada);

            //Now, get a few details of the transaction
            const receipt = tx.receipt; //the transaction receipt
            const tokenId = tx.id;//the id of the NFT minted
            const nft = await tx.data(); //Optional: Fetch details of the minted NFT

            //Once we get these details above we can use them according to our needs
            //for example  store them in the database or displaying them as a confirmation, etc.
            console.log('the TX data>>>', receipt, tokenId, nft);

            //Now redirect the user back to the homepage once the transaction is done.
            router.push('/');

        } catch (error) {
            console.log('An error ocurred:>>>', error);
        }
    }

    return (

        <div>
            <Header />
            {/* mx-auto: Center when the max width has been surpassed */}
            <main className='max-w-6xl mx-auto p-10 border'>
                <h1 className='text-4xl font-bold'>Add an Item to the Marketplace</h1>
                <h2 className='text-xl font-semibold pt-5'>Item details</h2>
                <p className='pb-5'>
                    By adding an item to the marketplace, you'e essentially Minting an
                    NFT of the item into your wallet which we can then list for sale!
                </p>
                <div className='flex flex-col md:flex-row justify-center items-center md:space-x-5 pt-10'>
                    <img
                        //If the preview is not set yet, then show a default image
                        src={preview || "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Backpack_%282551%29_-_The_Noun_Project.svg/640px-Backpack_%282551%29_-_The_Noun_Project.svg.png"}
                        alt="Rémy Médard, CC0, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Backpack_(2551)_-_The_Noun_Project.svg"
                        className='border h-80 w-80 object-contain'
                    />
                    {/* The form is gonna be responsible for holding all of the NFT information 
                    flex-1: is to use the majority of the screen space*/}
                    <form className='flex flex-col flex-1 p-2 space-y-2 justify-center'
                        onSubmit={mintNft}>
                        <label className='font-light' htmlFor="">Name of Item</label>
                        <input className='formField' placeholder='Name of Item...' type="text" name='name' id='name' />
                        <label className='font-light' htmlFor="">Description</label>
                        <input className='formField' placeholder='Enter Description...' type="text" name='description' id='description' />
                        <label className='font-light' htmlFor="">Image of the Item</label>
                        <input type="file" onChange={e => {
                            if (e.target.files?.[0]) {
                                //URL.createObjectURL gives us the URL with which we can show the image
                                setPreview(URL.createObjectURL(e.target.files[0]));
                                setImage(e.target.files[0]);
                            }
                        }} />
                        {/* ml-auto -> margin-left: auto in order to align the item to the left
                        mx-auto -> margin-left: auto; margin-right: auto; --> center the button  */}
                        <button type='submit' className='bg-blue-600 font-bold text-white rounded-full 
                        py-4 px-10 w-56 mt-50 md:mt-auto mx-auto md:ml-auto md:mr-0'>Add/Mint Item</button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AddItem