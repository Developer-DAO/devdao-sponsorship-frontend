import type { NextPage } from 'next';
import { FC, useEffect, useState } from 'react';
import {
  useAccount,
  useConnect,
  useContract,
  useDisconnect,
  useEnsName,
  useSigner,
} from 'wagmi';
import json from '@/public/data.json';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { mint } from '@/utils/deployAndMint';

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

  useEffect(() => {
    (async () => {
      try {
        if (contract) {
          const ownedToken = await contract.ownedToken(
            '0x0ED6Cec17F860fb54E21D154b49DAEFd9Ca04106'
          );
          const expiryTime = await contract.scholarshipExpires(ownedToken);
          const contractTokenURI = await contract.tokenURI(ownedToken);
          const res = await (await fetch(contractTokenURI)).json();
          setTokenURI(res.image);
          console.log({ ownedToken, expiryTime, res });
        }
      } catch (error) {}
    })();
  }, [contract]);

  return (
    <div className='p-20'>
      <ConnectButton />

      <input
        className='mt-10 border-2 block p-2 rounded'
        value={receiverAddress}
        onChange={(e) => setReceiverAddress(e.target.value)}
      />

      <button
        onClick={async () => {
          await mint(contract, account?.address as string, receiverAddress);
        }}
        className='bg-slate-200 rounded px-4 py-2 mt-4'
      >
        Mint a sponsorship!
      </button>

      <img className='w-[400px]' src={tokenURI} />
    </div>
  );
};

export default Home;
