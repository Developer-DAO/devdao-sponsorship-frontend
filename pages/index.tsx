import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import json from '@/public/data.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { mint } from '@/utils/deployAndMint';
import { toast, Toaster } from 'react-hot-toast';

const abi = json.abi;

const Home: NextPage = () => {
  const { data: account } = useAccount();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: '0xDd19C4b1f203bd7d8cc710e0b6B6FCF0459106BB',
    contractInterface: abi,
    signerOrProvider: signer,
  });
  const [receiverAddress, setReceiverAddress] = useState('');
  const [tokenURI, setTokenURI] = useState('');

  const [mintLoading, setMintLoading] = useState(false);

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const success = await mint(
        contract,
        account?.address as string,
        receiverAddress
      );
      if (success) {
        toast.success('Minted successfully');
        const ownedToken = await contract.ownedToken(receiverAddress);
        const contractTokenURI = await contract.tokenURI(ownedToken);
        const res = await (await fetch(contractTokenURI)).json();
        setTokenURI(res.image);
      } else {
        toast.error('Mint failed');
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setMintLoading(false);
    }
  };

  return (
    <div className='py-20 text-center'>
      <Toaster />
      <div className='w-full flex justify-center mb-10'>
        <ConnectButton showBalance={false} />
      </div>

      <h1 className='text-4xl font-bold'>Developer DAO sponsorship</h1>

      <p className='mt-2 text-slate-500 mx-auto max-w-2xl'>
        This project lets Developer DAO genesis NFT holders mint a sponsorship
        token for someone else to give them access to the DAO&apos;s membership
        for 60 days.
      </p>

      <input
        className='mt-10 border-2 block px-4 py-2 rounded mx-auto w-[400px]'
        value={receiverAddress}
        onChange={(e) => setReceiverAddress(e.target.value)}
        placeholder="enter the receiver's polygon address"
      />

      <button
        onClick={onMintClick}
        className='bg-slate-200 rounded px-4 py-2 mt-4 disabled:cursor-not-allowed disabled:opacity-50'
        disabled={!!mintLoading}
      >
        Mint a sponsorship!
      </button>

      {tokenURI && (
        <img className='w-[400px] border-2 rounded' src={tokenURI} />
      )}
    </div>
  );
};

export default Home;
