import React from "react";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import { useAccount, useNetwork } from "wagmi";
import { address_admin, address_user } from "@/const";

export const useIsCollection = () => {
  const symbol = "ABD";
  const { address: addressWallet } = useAccount();
  const [Band, setBand] = React.useState(false);



  const { chain: chain_network } = useNetwork();
  const permissionUser = async () => {
    if (!Moralis.Core.isStarted)
      await Moralis.start({
        apiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjE1MzJhYWU5LTk3ODEtNDYzOC1iZDkyLTBlMGNjMTBmMGI4OSIsIm9yZ0lkIjoiMTU0NTkxIiwidXNlcklkIjoiMTU0MjM1IiwidHlwZUlkIjoiZGY2NTBmOGQtZTVkZS00YjZhLWEzNTMtZDY1MDg5MmY0ZTRjIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTAzMDA3MTIsImV4cCI6NDg0NjA2MDcxMn0.fDn5x2anKsuKxYUk4Xs7nv-RDCORd067nQyR1TrduuE",
        // ...and any other configuration
      });
    const address = addressWallet || "";
    let band_results = false;
	
    if (chain_network?.id == process.env.NEXT_PUBLIC_NETWORK_ID) {
      const chain = EvmChain.GOERLI;
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });

      const results = await response.result;
      
      results.map((result: any) => {
       
        if (
          result._data.symbol === symbol &&
          !Band &&
          address === address_user
        ) {
         
          setBand(true);
          band_results = true;
          return true;
        }
      });
    }

    return band_results;
  };
	
  const permissionAdmin = () => {
    return addressWallet === address_admin;
  };

  return {
    permissionUser,
    permissionAdmin,
    symbol,
  };
};
