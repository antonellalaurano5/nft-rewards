import React from "react";

import Head from "next/head";

import "@fortawesome/fontawesome-free/css/all.min.css";

import "styles/tailwind.css";
import "styles/globals.css";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { goerli, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { SessionProvider } from "next-auth/react";
import { PermissionsProvider } from "@/context/permissions";
/* import { WalletConnectConnector } from "wagmi/connectors/walletConnect"; */

export default function App({ Component, pageProps }: any) {
  const Layout = Component.layout || (({ children }: any) => <>{children}</>);

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [goerli, sepolia],
    [publicProvider()]
  );
  // Set up wagmi config
  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "wagmi",
        },
      }),
      /* new WalletConnectConnector({
        chains,
        options: {
          projectId: "...",
        },
      }),*/
      new InjectedConnector({
        chains,
        options: {
          name: "Injected",
          shimDisconnect: true,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  });
  return (
    <React.Fragment>
      <WagmiConfig config={config}>
        <SessionProvider session={pageProps?.session}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>Notus NextJS by Creative Tim</title>
            <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>
          </Head>
          <PermissionsProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </PermissionsProvider>
        </SessionProvider>
      </WagmiConfig>
    </React.Fragment>
  );
}
