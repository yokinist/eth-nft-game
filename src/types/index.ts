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
  // #TODO: uint の type にする
  hp: any;
  maxHp: any;
  attackDamage: any;
} | null;
