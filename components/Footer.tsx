import React from "react";

type Props = {};

function Footer({}: Props) {
  return (
    <div className="flex flex-col border-t mt-1 pt-2 items-center text-sm bg-gray-100">
      <p>
        2022-2023{" "}
        <a
          className="text-blue-500"
          target="blank"
          href="https://rccc-resume1.web.app/"
        >
          RCCC
        </a>{" "}
        😎 Ebay-react with NFT demo
      </p>
      <h1 className="font-bold">Disclaimer</h1>
      <h1>
        Ebuy Logo based on original eBay Logo obtained from{" "}
        <a
          className="text-blue-500"
          target="blank"
          href="https://commons.wikimedia.org/wiki/File:EBay_logo.svg"
        >
          Wikimedia commons
        </a>
      </h1>
      <h1>
        This is a demo page implemented with Next.js, tailwindcss, thirdweb
        among other libraries for testing purposes only.
      </h1>
    </div>
  );
}

export default Footer;
