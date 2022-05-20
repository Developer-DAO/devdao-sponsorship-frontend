import { owners as rawSnapshot } from '@/public/data.json';
import MerkleTree from 'merkletreejs';
import { solidityKeccak256, keccak256 } from 'ethers/lib/utils';

// @ts-ignore
const uniqueOwners = [...new Set(rawSnapshot)];
const leaves = uniqueOwners.map((addr) =>
  solidityKeccak256(['address'], [addr])
);
const tree = new MerkleTree(leaves, keccak256, { sort: true });
const root = tree.getHexRoot();

console.log(root);

export { root, tree };
