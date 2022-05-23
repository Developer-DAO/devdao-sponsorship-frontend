import { getTreeAndRoot } from './createMerkleRoot';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { Contract } from 'ethers';

export const getProofForMint = async (signerAddress: string) => {
  const { tree } = await getTreeAndRoot();
  const proofForMint = tree.getHexProof(
    solidityKeccak256(['address'], [signerAddress])
  );

  return proofForMint;
};

export const mint = async (
  contract: Contract,
  signerAddress: string,
  receiverAddress: string
) => {
  try {
    const { tree } = await getTreeAndRoot();
    const proofForMint = tree.getHexProof(
      solidityKeccak256(['address'], [signerAddress])
    );

    const mintSponsor = await contract.sponsor(receiverAddress, proofForMint);
    const res = await mintSponsor.wait();
    console.log(res);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
