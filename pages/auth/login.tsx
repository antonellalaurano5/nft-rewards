import React from "react";
import Link from "next/link";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { /* useDisconnect, */ useNetwork, useSignMessage } from "wagmi";

import { InjectedConnector } from "wagmi/connectors/injected";

// layout for page

import { AuthLayout } from "@/layouts/Auth";
import { useRouter } from "next/router";
import { useAccount, useConnect } from "wagmi";
import { GetServerSideProps } from "next";
import { NetworkSwitcher } from "@/components/wagmi";

const Login = () => {
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    connector: new InjectedConnector(),
  });


  const handleLogin = async () => {
    try {
      const callbackUrl = "/";
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
			
      router.push("/admin/dashboard");
    } catch (error) {
      window.alert(error);
    }
  };
 
  

  return (
    <AuthLayout>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6 flex flex-col items-center">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign in with
                  </h6>
                </div>
                <div className="text-center flex flex-col gap-y-4 items-center pt-10">
                  {!isConnected &&
                    connectors?.map((connector) => {
                      return (
                        <button
                          key={connector.id}
                          className="bg-white active:bg-blueGray-50 text-blueGray-700  px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150 w-[200px]"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (connector.ready) {
                              connect({ connector });
                            }
                          }}
                        >
                          {connector.name}
                          {isLoading &&
                            connector.id === pendingConnector?.id &&
                            " (connecting)"}
                        </button>
                      );
                    })}
                </div>
                {isConnected && <NetworkSwitcher></NetworkSwitcher>}
                {isConnected && (
                  <button
                    type="button"
                    className="bg-white active:bg-blueGray-50 mt-4 text-blueGray-700  px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150 w-[200px]"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogin();
                    }}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2 text-right">
                <Link href="/auth/register"></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: "/admin/dashboard",
      permanent: false,
    },
  };
};
export default Login;

/* Login.layout = AuthLayout; */
