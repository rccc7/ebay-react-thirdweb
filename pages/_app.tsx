import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import nettowrk from '../utils/network'

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    //Here, isntead of using Mainnet we'll use Mumbai
    //Instead to call ChainId.Mumbai, we call network in which  file it
    //default exports ChainId.Mumbai
    <ThirdwebProvider desiredChainId={nettowrk}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp
