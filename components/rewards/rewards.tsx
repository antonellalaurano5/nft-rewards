import { useModal } from '@/hooks/modal';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import { useAccount } from 'wagmi';
import { UserType } from '@/interfaces/user';
import { useQuery } from 'react-query';
import axios from 'axios';
import { CardProfile } from '../Cards';
const web3 = new Web3(Web3.givenProvider);

const url = "https://white-deaf-kangaroo-277.mypinata.cloud"

export const RewardsComponent = () => {
	const { Modal, hide, isShow, show } = useModal();
	const { Modal: ModalUsers, isShow: isShowUsers, show: showUsers } = useModal();
  const { address } = useAccount();
  
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<any>(null);
  const [ipfs, setIpfs] = useState<any[]>([]);
  const [nfts, setNfts] = useState<any[]>([]);
  const [tokeId, setTokenId] = useState<string>('');

  const {
		data: users,
		//isLoading,
	} = useQuery<UserType[] | undefined>('USERS', async () => {
    const response = await axios.get('/api/users');
    if (response?.data?.usersData) {
      return response.data.usersData
    } else {
      return [];
    }
  }, {
		refetchOnWindowFocus: false,
	});

  const getFiles = async (): Promise<void> => {
    try {
      const res = await fetch("/api/files");
      const json = await res.json();
      if (json.rows.length) {
        const ipfsDetalis = await Promise.all(
          json.rows.filter((item: any) => !item.date_unpinned).map(async (item: any) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${item.ipfs_pin_hash}`);
            const text = await res.text()
            try {
              const metadata = JSON.parse(text);
              const metadataUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${item.ipfs_pin_hash}`;
              return { metadata, metadataUrl };
            } catch (error) {
              return null
            }
          })
        );
        setIpfs(ipfsDetalis.filter((item) => item));
      }
    } catch (e) {
      console.log(e);
      alert("trouble loading files");
    }
  }

  useEffect(() => {
    getFiles();
  }, []);


  const uploadFile = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file, name);
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();
      
      const image = `${url}/ipfs/${ipfsHash}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_TOKEN}`
      uploadJson(image)
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const uploadJson = async (image: string) => {
    try {
      setUploading(true);
      const metadata = JSON.stringify({
        name,
        description,
        image
      })
      const blob = new Blob([metadata], { type: "text/plain" });
      const data = new FormData();
      data.append("file", blob);
      await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      //const ipfsHash = await res.text();
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading JSON");
    }
  };

  const fetchNFTs = async () => {
    try {
      // Obtener instancia del contrato
      const contract = new web3.eth.Contract(contractABI as any, contractAddress);

      // Obtener eventos de transferencia
      const transferEvents = await contract.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest'
      });

      // Filtrar eventos para obtener solo los relacionados con el contrato de NFT
      const nftEvents = transferEvents.filter(event => event.address === contractAddress);

      // Obtener los detalles de los NFTs minteados
      const nftDetails = await Promise.all(
        nftEvents.map(async event => {
          const tokenId = event.returnValues.tokenId;
          const owner = await contract.methods.ownerOf(tokenId).call();
          const tokenURI = await contract.methods.tokenURI(tokenId).call();
      
          // Obtener metadata desde IPFS
          const response = await fetch(tokenURI);
          const metadata = await response.json();
      
          return { tokenId, owner, metadata };
        })
      );
      setNfts(nftDetails.filter((nft: any) => nft.owner == address));
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  const mint = async (e: FormEvent, metadataUrl: string) => {
    e.preventDefault();
    try {
      const contract = new web3.eth.Contract(contractABI as any, contractAddress);
      const response = await contract.methods
        .safeMint(address, metadataUrl)
        .send({ from: address });
      const tokenId = response.events.Transfer.returnValues.tokenId;
      alert(
        `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
      );
      fetchNFTs();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const transfer = async (addessTo: string) => {
    if (tokeId){
      try {
        const contract = new web3.eth.Contract(contractABI as any, contractAddress);
        const response = await contract.methods
          .safeTransferFrom(address, addessTo, tokeId)
          .send({ from: address });
        const tokenId = response.events.Transfer.returnValues.tokenId;
        console.log(tokenId)
        alert(
          `NFT successfully transfer. Contract address - ${contractAddress} and Token ID - ${tokenId}`
        );
        fetchNFTs();
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    setFile(file)
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };

	return (
    <div className="mt-28 min-h-screen pb-20 flex justify-center">
      <div className="relative max-w-3xl">
        <div className="w-full flex justify-between">
          <h5 className="text-2xl font-bold">Rewards</h5>
          
          <button
            className="text-white font-bold p-2 text-xs bg-orange-400 rounded-lg"
            onClick={show}
          >
            {" "}
            + New IPFS{" "}
          </button>
        </div>
        <h3 className="font-bold mt-10">NFT</h3>
        <div className="mt-5 grid grid-cols-2 lg:grid-cols-3">
          {nfts?.filter((item) => item).map((nft) => (
            <div key={nft.metadata?.image} className="shadow-2xl p-4 rounded-lg max-w-[200px] flex flex-col justify-between">
            <div>
              <div>
                <p className="font-bold ">{nft.metadata?.name}</p>
              </div>
              <div className="flex justify-center mt-5">
                <img
                  src={nft.metadata?.image}
                  alt=""
                  className="w-20 h-20 rounded-lg"
                />
              </div>
            </div>
            <div>
              <p className="">{nft.metadata?.description}</p>
            </div>
						<div>
							<button
                className="bg-slate-800 p-2 rounded-lg text-white font-medium mt-4 w-full"
                onClick={() => {
                  setTokenId(nft.tokenId)
                  showUsers();
                }}
              >
								Transfer
							</button>
						</div>
          </div>
          ))}
        </div>
        <h3 className="font-bold mt-10">IPFS</h3>
        <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {ipfs?.map((item) => (
            <div key={item.metadata?.image} className="shadow-2xl p-4 rounded-lg max-w-[200px] flex flex-col justify-between">
            <div>
              <div>
                <p className="font-bold ">{item.metadata?.name}</p>
              </div>
              <div className="flex justify-center mt-5">
                <img
                  src={item.metadata?.image}
                  alt=""
                  className="w-20 h-20 rounded-lg"
                />
              </div>
            </div>
            <div>
              <p className="">{item.metadata?.description}</p>
            </div>
						<div>
							<button 
                className="bg-slate-800 p-2 rounded-lg text-white font-medium mt-4 w-full"
                onClick={(e) => mint(e, item.metadataUrl)}
              >
								Mint
							</button>
						</div>
          </div>
          ))}
        </div>
      </div>
      <Modal isShow={isShow}>
        <div>
          <div className="text-center">
            <p className="font-bold text-4xl ">New IPFS</p>
          </div>
          <div>
            <input
              type="text"
              className="border rounded-lg p-2 text-lg border-gray-400 w-full mt-8"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              className="border rounded-lg p-2 text-lg border-gray-400 w-full mt-4"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            disabled={uploading}
            className="bg-slate-800 p-2 rounded-lg text-white font-medium mt-4 w-full"
            onClick={() => {
              document?.getElementById('file')?.click();
            }}
          >
            Upload file
          </button>
          </div>
          {previewUrl && (
            <img
              src={previewUrl}
              className="mt-4 w-40"
            />
          )}
          <div className="flex gap-x-4 justify-end mt-10">
            <button
              className="bg-red-600 py-2 px-4 rounded-lg text-white font-bold"
              onClick={() => {
                hide();
              }}
            >
              Cancel
            </button>
            <button
              disabled={uploading}
              className="bg-green-600 py-2 px-4 rounded-lg text-white font-bold"
              onClick={() => {
                uploadFile();
                hide();
              }}
            >
               {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </Modal>
      <ModalUsers isShow={isShowUsers}>
        <div>
          <div className="text-center">
            <p className="font-bold text-4xl ">New IPFS</p>
          </div>
          <div>
          <div className="flex gap-x-4 gap-12">
            {users?.map((user) => (
              <CardProfile
                key={user.id}
                user={user}
                onClick={(id) => transfer(id)}
              />
            ))}
          </div>
          </div>
        </div>
      </ModalUsers>
    </div>
  );
}
