import { BigNumber } from '@ethersproject/bignumber';
import { MetaMaskInpageProvider as MetaMaskInpageProviderType } from '@metamask/providers';

export type EthereumType = MetaMaskInpageProviderType;

export type FormattedCharacterType = {
  name: string;
  imageURI: string;
  hp: number;
  maxHp: number;
  attackDamage: number;
} | null;

export type CharacterType = {
  name: string;
  imageURI: string;
  hp: BigNumber;
  maxHp: BigNumber;
  attackDamage: BigNumber;
} | null;
