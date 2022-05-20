import { tree } from './createMerkleRoot';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { Contract } from 'ethers';

export const mint = async (
  contract: Contract,
  signerAddress: string,
  receiverAddress: string
) => {
  const proofForMint = tree.getHexProof(
    solidityKeccak256(['address'], [signerAddress])
  );

  const mintSponsor = await contract.sponsor(receiverAddress, proofForMint);
  const res = await mintSponsor.wait();
  console.log(res);
};
