import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import network from "../utils/network";

function MyApp({ Component, pageProps }: AppProps) {
  // console.log(
  //   "The client id:>>>",
  //   process.env.NEXT_PUBLIC_THIRDWEB_API_CLIENTID
  // );
  return (
    //Here, isntead of using Mainnet we'll use Mumbai
    //Instead to call ChainId.Mumbai, we call network in which  file it
    //default exports ChainId.Mumbai
    // RCCC Former verrsion before using API key
    // <ThirdwebProvider  desiredChainId={nettowrk}>
    //   <Component {...pageProps} />
    // </ThirdwebProvider>

    // new Version after aplying API Key
    <ThirdwebProvider
      activeChain={network}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_API_CLIENTID}
      supportedWallets={[metamaskWallet()]}
      // clientId="adfasdfadfasd"
      // clientId={undefined}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
