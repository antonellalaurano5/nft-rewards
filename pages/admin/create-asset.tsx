import React, { FormEvent, useState } from "react";
import Web3 from "web3";
import { contractABI } from "../../contract";
const web3 = new Web3(Web3.givenProvider);

// components

// layout for page

import { AdminLayout } from "@/layouts/Admin";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const { address } = useAccount();

  const [metadataurl, setMetadaUrl] = useState<string>('');
  // const [name, setName] = useState<string>('');
  // const [description, setDescription] = useState<string>('');
  // const [file, setFile] = useState<any>(null);
  
  console.log(metadataurl)


  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const contract = new web3.eth.Contract(contractABI as any, process.env.CONTRACT_ADDRESS);
      const response = await contract.methods
        .safeMint(address, metadataurl)
        .send({ from: address });
        // .mint(metadataurl)
        // .send({ from: address });
        console.log(response)
      const tokenId = response.events.Transfer.returnValues.tokenId;
      console.log(tokenId)
      alert(
        `NFT successfully minted. Contract address - ${process.env.CONTRACT_ADDRESS} and Token ID - ${tokenId}`
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex flex-wrap h-screen">
        <div className="mt-40 w-full">
          <h1 className="w-full text-center text-4xl font-bold" >
            Create Asset
          </h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-9">
            <div>
              <input
                type="text"
                className="border p-2 text-lg border-black w-full"
                placeholder="Metadata URL"
                value={metadataurl}
                onChange={(e) => setMetadaUrl(e.target.value)}
              />
            </div>
            {/* <div>
              <input
                type="text"
                className="border p-2 text-lg border-black w-full"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                className="border p-2 text-lg border-black w-full"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
            <input
              type="file"
              className="border p-2 text-lg border-black w-full"
              onChange={(e) => e.target.files?.length && setFile(e.target.files[0])}
            />
            </div> */}
            <button type="submit" className="mt-5 w-full p-5 bg-green-700 text-white text-lg rounded-lg">
              Mint now!
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
Dashboard.layout = AdminLayout;
