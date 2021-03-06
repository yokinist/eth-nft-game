import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import EpicGameABI from '@/artifacts/contracts/EpicGame.sol/EpicGame.json';
import { formatBossData } from '@/libs/formatBossData';
import { formatCharacterData } from '@/libs/formatCharacterData';
import { CharacterType, FormattedBossType, FormattedCharacterType } from '@/types';
import { getEthereumSafety } from '@/utils';

const CONTRACT_ADDRESS = '0x35168F7777ec08a8d65601646Db34fB15b9aF30C';
const CONTRACT_ABI = EpicGameABI.abi;

type Props = {
  enable: boolean;
};

type AttackState = 'attacking' | 'hit' | '';
type ReturnUseWaveContract = {
  isLoading: boolean;
  mining: boolean;
  healing: boolean;
  showToast: boolean;
  attackState: AttackState;
  boss: FormattedBossType | null;
  allCharacters: FormattedCharacterType[];
  characterNFT: FormattedCharacterType | null;
  runAttackAction: () => void;
  healCharacterHP: () => void;
  mintCharacterNFTAction: (characterId: number) => void;
};

export const useGameContract = ({ enable }: Props): ReturnUseWaveContract => {
  const [boss, setBoss] = useState<FormattedBossType | null>(null);
  const [characterNFT, setCharacterNFT] = useState<FormattedCharacterType | null>(null);
  const [allCharacters, setAllCharacters] = useState<FormattedCharacterType[]>([]);

  const [showToast, setShowToast] = useState<boolean>(false);

  const [attackState, setAttackState] = useState<'attacking' | 'hit' | ''>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mining, setMining] = useState<boolean>(false);
  const [healing, setHealing] = useState<boolean>(false);
  const ethereum = getEthereumSafety();

  const gameContract = useMemo(() => {
    if (!ethereum) return null;
    // #TODO: ๅ็ดใ
    // @ts-ignore: ethereum as ethers.providers.ExternalProvider
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [ethereum]);

  const mintCharacterNFTAction = useCallback(
    (characterId: number) => async () => {
      if (!gameContract) return;
      try {
        console.info('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        setMining(true);
        await mintTxn.wait();
        console.info('mintTxn:', mintTxn);
        setMining(false);
      } catch (error) {
        console.warn('MintCharacterAction Error:', error);
      }
    },
    [gameContract],
  );

  const healCharacterHP = useCallback(async () => {
    if (!gameContract) return;
    try {
      console.info('Giveback character in progress....');
      const mintTxn = await gameContract.healHP();
      setHealing(true);
      await mintTxn.wait();
      console.info('mintTxn:', mintTxn);
      setHealing(false);
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
  }, [gameContract]);

  const runAttackAction = useCallback(async () => {
    if (!gameContract) return;
    try {
      console.info('Attacking boss...');
      const attackTxn = await gameContract.attackBoss();
      setAttackState('attacking');
      await attackTxn.wait();
      console.info('attackTxn:', attackTxn);
      setAttackState('hit');
      // ๆปๆใใกใผใธใฎ่กจ็คบใtrueใซ่จญๅฎใ๏ผ่กจ็คบ๏ผใ5็งๅพใซfalseใซ่จญๅฎใใ๏ผ้่กจ็คบ๏ผ
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } catch (error) {
      console.error('Error attacking boss:', error);
      setAttackState('');
    }
  }, [gameContract]);

  const getCharacters = useCallback(async (gameContract: ethers.Contract) => {
    if (!gameContract) return;
    try {
      console.info('Getting contract characters to mint');
      // ใใณใๅฏ่ฝใชๅจ NFT ใญใฃใฉใฏใฟใผ ใใณใณใใฉใฏใใใใๅผใถ
      const charactersTxn: CharacterType[] = await gameContract.getAllDefaultCharacters();

      console.info('charactersTxn:', charactersTxn);

      const characters = charactersTxn.map((characterData) => formatCharacterData(characterData));

      setAllCharacters(characters);
    } catch (error) {
      console.error('Something went wrong fetching characters:', error);
    }
  }, []);

  // ๆปๆๅฎไบใใใ่ตทๅใใใณใผใซใใใฏ
  const onAttackComplete = (newBossHp: BigNumber, newPlayerHp: BigNumber) => {
    const bossHp = newBossHp.toNumber();
    const playerHp = newPlayerHp.toNumber();
    console.info(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

    setBoss((prevState) => {
      if (!prevState) return null;
      return { ...prevState, hp: bossHp };
    });

    setCharacterNFT((prevState) => {
      if (!prevState) return null;
      return { ...prevState, hp: playerHp };
    });
  };

  const onHealComplete = (newBossHp: BigNumber, newPlayerHp: BigNumber) => {
    const bossHp = newBossHp.toNumber();
    const playerHp = newPlayerHp.toNumber();
    console.info(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

    setBoss((prevState) => {
      if (!prevState) return null;
      return { ...prevState, hp: bossHp };
    });

    setCharacterNFT((prevState) => {
      if (!prevState) return null;
      return { ...prevState, hp: playerHp };
    });
  };

  // ใคใใณใใๅไฟกใใใจใใซ่ตทๅใใใณใผใซใใใฏใกใฝใใ
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
    setIsLoading(false);
  }, []);

  const fetchBoss = useCallback(async (gameContract: ethers.Contract) => {
    const bossTxn = await gameContract.getBigBoss();
    console.info('Boss:', bossTxn);
    setBoss(formatBossData(bossTxn));
  }, []);

  useEffect(() => {
    if (!gameContract || !enable || !characterNFT) return;
    gameContract.on('AttackComplete', onAttackComplete);
    gameContract.on('HealComplete', onHealComplete);
    return () => {
      gameContract.off('AttackComplete', onAttackComplete);
      gameContract.off('HealComplete', onHealComplete);
    };
  }, [gameContract, enable, characterNFT]);

  useEffect(() => {
    if (!gameContract || !enable) return;
    setIsLoading(true);
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
    isLoading,
    mining,
    healing,
    showToast,
    attackState,
    boss,
    allCharacters,
    characterNFT,
    healCharacterHP,
    runAttackAction,
    mintCharacterNFTAction,
  };
};
