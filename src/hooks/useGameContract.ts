import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EpicGameABI from '@/artifacts/contracts/EpicGame.sol/EpicGame.json';
import { formatCharacterData } from '@/libs/formatCharacterData';
import { CharacterType, FormattedCharacterType } from '@/types';
import { getEthereumSafety } from '@/utils';

const CONTRACT_ADDRESS = '0x5897AB265B7B6d1B79F240C0E50EeF677b9Cff4a';
const CONTRACT_ABI = EpicGameABI.abi;

type Props = {
  enable: boolean;
};

type ReturnUseWaveContract = {
  mining: boolean;
  boss: FormattedCharacterType;
  allCharacters: FormattedCharacterType[];
  characterNFT: FormattedCharacterType;
  mintCharacterNFTAction: (characterId: number) => void;
  handleSetCharacterNFT: (nextVal: FormattedCharacterType) => void;
};

export const useGameContract = ({ enable }: Props): ReturnUseWaveContract => {
  const [boss, setBoss] = useState<FormattedCharacterType>(null);
  const [characterNFT, setCharacterNFT] = useState<FormattedCharacterType>(null);
  const [allCharacters, setAllCharacters] = useState<FormattedCharacterType[]>([]);

  const [mining, setMining] = useState<boolean>(false);
  const ethereum = getEthereumSafety();

  const gameContract = useMemo(() => {
    if (!ethereum) return null;
    // #TODO: 型直す
    // @ts-ignore: ethereum as ethers.providers.ExternalProvider
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [ethereum]);

  const handleSetCharacterNFT = (nextVal: typeof characterNFT) => {
    setCharacterNFT(nextVal);
  };

  const mintCharacterNFTAction = useCallback(
    (characterId: number) => async () => {
      console.debug({ characterId });
      if (!gameContract) return;
      try {
        console.info('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.info('mintTxn:', mintTxn);
      } catch (error) {
        console.warn('MintCharacterAction Error:', error);
      }
    },
    [gameContract],
  );

  const getCharacters = useCallback(async (gameContract: ethers.Contract) => {
    if (!gameContract) return;
    try {
      console.info('Getting contract characters to mint');
      // ミント可能な全 NFT キャラクター をコントラクトをから呼ぶ
      const charactersTxn: CharacterType[] = await gameContract.getAllDefaultCharacters();

      console.info('charactersTxn:', charactersTxn);

      const characters = charactersTxn.map((characterData) => formatCharacterData(characterData));

      setAllCharacters(characters);
    } catch (error) {
      console.error('Something went wrong fetching characters:', error);
    }
  }, []);

  // イベントを受信したときに起動するコールバックメソッド
  const onCharacterMint = useCallback(
    async (sender: any, tokenId: any, characterIndex: any) => {
      if (!gameContract) return;
      console.debug({ sender });
      console.debug({ tokenId });
      console.debug({ characterIndex });
      console.info(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`,
      );
      const characterNFT = await gameContract.checkIfUserHasNFT();
      console.info('CharacterNFT: ', characterNFT);
      setCharacterNFT(formatCharacterData(characterNFT));
      alert(
        `NFT キャラクーが Mint されました -- リンクはこちらです: https://rinkeby.rarible.com/token/${
          gameContract.address
        }:${tokenId.toNumber()}?tab=details`,
      );
    },
    [gameContract],
  );

  const fetchNFTMetadata = useCallback(async (gameContract: ethers.Contract) => {
    const txn = await gameContract.checkIfUserHasNFT();
    if (txn.name) {
      console.info('User has character NFT');
      setCharacterNFT(formatCharacterData(txn));
    } else {
      console.info('No character NFT found');
    }
  }, []);

  const fetchBoss = useCallback(async (gameContract: ethers.Contract) => {
    const bossTxn = await gameContract.getBigBoss();
    console.info('Boss:', bossTxn);
    setBoss(formatCharacterData(bossTxn));
  }, []);

  useEffect(() => {
    if (!gameContract || !enable) return;
    fetchNFTMetadata(gameContract);
    getCharacters(gameContract);
    fetchBoss(gameContract);
    gameContract.on('CharacterNFTMinted', onCharacterMint);
    return () => {
      gameContract.off('CharacterNFTMinted', onCharacterMint);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameContract, enable]);

  return {
    mining,
    boss,
    allCharacters,
    characterNFT,
    mintCharacterNFTAction,
    handleSetCharacterNFT,
  };
};
