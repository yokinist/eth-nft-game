import { BigNumber } from '@ethersproject/bignumber';
import { MetaMaskInpageProvider as MetaMaskInpageProviderType } from '@metamask/providers';

export type EthereumType = MetaMaskInpageProviderType;

export type FormattedBossType = {
  name: string;
  imageURI: string;
  hp: number;
  maxHp: number;
  attackDamage: number;
} | null;

export type FormattedCharacterType = {
  index: number;
  name: string;
  imageURI: string;
  hp: number;
  maxHp: number;
  attackDamage: number;
} | null;

export type CharacterType = {
  characterIndex: BigNumber;
  name: string;
  imageURI: string;
  hp: BigNumber;
  maxHp: BigNumber;
  attackDamage: BigNumber;
} | null;

export type BossType = {
  name: string;
  imageURI: string;
  hp: BigNumber;
  maxHp: BigNumber;
  attackDamage: BigNumber;
} | null;
