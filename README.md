# EBay-react + ThirdWeb

EBay-like portal. Demo page similar to eBay UI that simulates the purchase and sale procedure but with NFTs instead of items and cryptocurrency instead of money. Users can log in using their Metamask crypto wallet account. Once logged in, the user can start mining ("Add to Inventory" option) and list their NFTs with the options of "Buy Now" or list them as an "Auction". Then users can purchase or bid the listed items.

Try it out at: https://ebay-react-thirdweb.vercel.app

## Screenshots:

<div align="center">
  <img src="screenshots/Ebay-react.jpg" alt="screenshot" width="700" style="width:700px;"/>
</div>

## Basic Ussage:

1. Download and install the [METAMASK](https://metamask.io/download/) on your brower if you haven't installed yet.
2. Log in to your Metamask account by clicking the "Connect your wallet" button located at the uper left corner.
   NOte: By the The test network used in this application is Mumbai and once you install the metamask extension and login to your wallet the system asks to join to that network. In future releases there could be the option to select the network.
3. In order to make transactions you can request and get TEST goerli eth funds by following these steps:
   3.1. Create a free account and sign in at https://www.alchemy.com.
   3.2. Go to https://goerlifaucet.com/ and enter you Metamask wallet address (0x...) and click on the "Send me ETH" button. You can request 0.2 Goerli ETH every 24 hours with a free account.
4. To add an Item to the Marketplace click on the "Add to Inventory" button att the uper right corner of the page.
   4.1. Fill in the name, description and picture of the item and click on "Add/Mint Item" button.
   4.2. When the Metamask window loads click on the "Confirm" button.
   4.3. If the transaction succeded a confirmation message will raise and then you can list the Item.
5. To list the item click on the "List Item" button.
   5.1. In the list of items select the item's picture you want to list.
   5.2. Select the option Direct Listing if you want list the item as as a direct listing or Auction if you want to list the item in an auction.
   5.3. Enter the price. It is sugested to enter a very low price with more than 2 or 3 decimals in order to be able to do various tests.
   5.4. Click on the "Create listing" button and on the "Confirm" button when the metamask window raises.
   5.5. If everything went well, the application will be redirected to the main screen and the new Item listing/auction will be displayed in the list.
6. To purchase an Item from the main screen click on the "Buy Now" button or on the "Auction" button depending on how the item is listed. The next screen will show th details and the options to purchase the Item.
   6.1 If you clicked on "Auction" then you have two options: Either to inmediately purchase by clicking on "Buy Now" button or to place a bid by first entering the minimum amount and clicking on the "Bid" button. After selecting your option click on "Confirm" in the metamask window. If everything went well the application will confirm your transaction as well as the metamask message.
   6.2. If you clicked on "Buy Now" then in the details screen click on "Buy Now" button again and confirm the transaction in the metamask notification. If everything went right the transaction will be confirmed on your metamask wallet and the application will redirect to the main screen.
   6.2.1. IMPORTANT: Do not click on the "Offer" red button button since this functionality is not fully implemented and contains bugs. If you click on that option, in certain circunstances an error notification with a message like "ERROR: Offer culd not be made" might raise.

## Technologies:

This example shows how to use the following technologies, components and services:

- [React.js](https://reactjs.org/), the best JavaScript library for building user interfaces.
- [Next.js](https://nextjs.org/), one of the best and complete framework for react.js application.
- [Vercel](https://vercel.com/) free account to deploy and host the application.
- [Tailwind CSS](https://tailwindcss.com/).
- [Thirdweb react SDK](https://portal.thirdweb.com/react) to test the usage of NFTs and cryptocurrencies transactions in React.
- [METAMASK](https://metamask.io/download/) crypto wallet.
- [Heroicons](https://heroicons.com).
- [React-hot-toast](https://react-hot-toast.com/), one of the best notification and easy to use component for react.

## Disclaimer

This is only a demo application with the intention of testing and practicing the latest Next.js framework feactures for React as well as for testing the [Thirdweb react SDK](https://portal.thirdweb.com/react).

## Step by Step Setup & Deployment Instructions from scratch

1.  Create the app in a terminal window and install with the official tailwind css example which includes typescript by default:
    ```bash
    npx create-next-app -e with-tailwindcss ebay-react
    ```
2.  Install [thirdweb react sdk](https://portal.thirdweb.com/react)
    ```bash
    npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers
    ```
3.  Configure the thirdweb provider at the root of the application as described in https://portal.thirdweb.com/react. Note: The file to modify is "\_app.tsx"
4.  Install heroicons from heroicons.com
    ```bash
    npm install @heroicons/react
    ```
5.  Create the .env.local file to save the environment variables. This file will contain the addresses of the marketplace and nft collection so that we can test the application locally.
6.  Upload to Github and deploy to Vercel.

    6.1. Create the github repository ebay-react-thirdweb.

    6.2. In Vercel, click add new project and select the just created github project from the list by selecting the option to import from github.

        - In the options above the "Deploy" button there is one for setting up the environment variables. In that option add the variales saved in the .env.local file and their corresponding values.
        - Click deploy and if everything was right, we'll get a link to the deployed version.

7.  Install react-countdown to display the auction remaining time: react-countdown npm

    ```bash
    npm install react-countdown
    ```

8.  Install react-hot-toast. See documentation at https://react-hot-toast.com/

    ```bash
    npm i react-hot-toast
    ```

For more info on how to deploy to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) see ([Documentation](https://nextjs.org/docs/deployment)).
