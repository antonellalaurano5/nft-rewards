import React from "react";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

import clsx from "clsx";
import { useAccount } from "wagmi";
import { useIsCollection } from "@/hooks";
import { useModal } from "@/hooks/modal";

/* import { ethers } from "ethers"; */

export const MyAssetsComponent = () => {
  const { address: addressWallet } = useAccount();
  const [AssetsNfts, setAssetsNfts] = React.useState<any>();
  const [AssetsTokens, setAssetsTokens] = React.useState<any>();
  const [Option, setOption] = React.useState("NFTS");
  const { symbol } = useIsCollection();
  const [DataAsset, setDataAsset] = React.useState<any>();

  const { Modal, hide, isShow, show } = useModal();
  const RunApp = async () => {
    if (!Moralis.Core.isStarted)
      await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        // ...and any other configuration
      });
    const address = addressWallet || "";
    const chain = EvmChain.GOERLI;
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
    });

    const results = await response.result;
    setAssetsNfts(results);

    const resultsTokens = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: chain,
      address: address,
    });

   
    setAssetsTokens(resultsTokens.raw);
  };

  React.useEffect(() => {
    if (!AssetsNfts && !AssetsTokens) {
      RunApp();
    }
  }, []);
  const tabs = [
    { name: "Nfts", href: "NFTS" },
    { name: "Tokens", href: "TOKENS" },
  ];

  const getBalanceTokens = (balance: string, decimals?: string) => {
    const result = Number(balance) / 10 ** (Number(decimals) - 1 || 1);

    return result.toFixed(2);
   
  };

  return (
    <div className="relative">
      <div>
        <h5 className="text-2xl font-bold text-white">My Assets</h5>
      </div>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          
        </div>
        <div className="block">
          <div className="">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => {
                    setOption(tab.href);
                  }}
                  className={clsx(
                    "focus:outline-none",
                    tab.href === Option
                      ? "border-lightBlue-600 text-lightBlue-600"
                      : "border-transparent text-gray-500 hover:border-gray-400 hover:text-gray-400",
                    "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4  gap-x-4 gap-y-4 mt-6">
        {Option === "NFTS" &&
          AssetsNfts?.map((asset: any, index: number) => {
            if (asset._data?.symbol === symbol) {
              return (
                <div key={index} className="px-4 py-3 bg-white rounded-lg">
                  <div>
                    <img src={asset._data?.metadata?.image || ""} alt="" />
                  </div>
                  <div className="pt-2">
                    <p className="text-base font-semibold">
                      {asset._data?.metadata?.name}{" "}
                    </p>
                  </div>
                  <div className="mt-3">
                    <button
                      className="bg-green-600 p-1 rounded-lg text-white font-bold"
                      onClick={() => {
                        show();
                        setDataAsset(asset._data);
                      }}
                    >
                      Claim
                    </button>
                  </div>
                </div>
              );
            }
          })}

        {Option === "TOKENS" &&
          AssetsTokens?.map((asset: any, index: number) => {
            return (
              <div
                key={index}
                className="px-4 py-3 bg-white rounded-lg flex flex-col gap-y-2"
              >
                <div>
                  <p className="break-words font-bold text-xl">
                    {" "}
                    {asset?.symbol}{" "}
                  </p>
                </div>
                <div>
                  <p className="break-words font-medium text-lg">
                    {asset?.name}
                  </p>
                </div>
                <div>
                  <p className="font-normal text-slate-500">
                    ${getBalanceTokens(asset?.balance, asset?.decimals)}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      <Modal isShow={isShow}>
        <div>
          <div className="text-center">
            <p className="font-bold text-4xl ">Claim your reward</p>
          </div>
          <div className="mt-2">
            <div className="px-4 py-3 bg-white rounded-lg">
              <div className="flex justify-center">
                <img
                  src={DataAsset?.metadata?.image || ""}
                  alt=""
                  className="w-[250px] h-[250px]"
                />
              </div>
              <div className="pt-2 text-center">
                <p className="text-base font-semibold">
                  {DataAsset?.metadata?.name}{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-x-4 justify-end mt-10">
            <button
              className="bg-red-600 p-2 rounded-lg text-white font-bold"
              onClick={() => {
                hide();
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 p-2 rounded-lg text-white font-bold"
              onClick={() => {
                hide();
              }}
            >
              Claim
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
