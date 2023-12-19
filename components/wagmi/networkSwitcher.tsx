import React from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
export const NetworkSwitcher = () => {
  const { chain } = useNetwork();
  const { chains, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  return (
    <div className="text-center">
      <p className="text-blueGray-500 font-bold"> Connected to {chain?.name}</p>

      <p className="text-red-400">{chain?.unsupported && " (unsupported)"}</p>
      {switchNetwork && chain?.unsupported && (
        <div className="pt-5 flex flex-row gap-x-5 justify-center">
          {chains.map((x) => {
            return x.id === chain?.id ? null : (
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-2xl"
                key={x.id}
                onClick={() => switchNetwork(x.id)}
              >
                Change to {x.name}
                {isLoading && x.id === pendingChainId && " (switching)"}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
