import { ethers } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import EpicGameABI from '@/artifacts/contracts/EpicGame.sol/EpicGame.json';
import { formatCharacterData } from '@/libs/formatCharacterData';
import { CharacterType, FormattedCharacterType } from '@/types';
import { getEthereumSafety } from '@/utils';

const CONTRACT_ADDRESS = '0xd253B93f927603b2Dabbbd253D626c04D0bdfd61';
const CONTRACT_ABI = EpicGameABI.abi;

type Props = {
  enable: boolean;
};

type AttackState = 'attacking' | 'hit' | '';
type ReturnUseWaveContract = {
  mining: boolean;
  attackState: AttackState;
  boss: FormattedCharacterType;
  allCharacters: FormattedCharacterType[];
  characterNFT: FormattedCharacterType;
  runAttackAction: () => void;
  mintCharacterNFTAction: (characterId: number) => void;
  handleSetCharacterNFT: (nextVal: FormattedCharacterType) => void;
};

export const useGameContract = ({ enable }: Props): ReturnUseWaveContract => {
  const [boss, setBoss] = useState<FormattedCharacterType>(null);
  const [characterNFT, setCharacterNFT] = useState<FormattedCharacterType>(null);
  const [allCharacters, setAllCharacters] = useState<FormattedCharacterType[]>([]);

  const [attackState, setAttackState] = useState<'attacking' | 'hit' | ''>('');

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

  const runAttackAction = useCallback(async () => {
    if (!gameContract) return;
    try {
      setAttackState('attacking');
      console.info('Attacking boss...');
      const attackTxn = await gameContract.attackBoss();
      await attackTxn.wait();
      console.info('attackTxn:', attackTxn);
      setAttackState('hit');
    } catch (error) {
      console.error('Error attacking boss:', error);
      setAttackState('');
    }
  }, [gameContract]);

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

  // 攻撃完了したら起動するコールバック
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
    if (!gameContract || !enable || !characterNFT) return;
    gameContract.on('AttackComplete', onAttackComplete);
    return () => {
      gameContract.off('AttackComplete', onAttackComplete);
    };
  }, [gameContract, enable, characterNFT]);

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
    attackState,
    boss,
    allCharacters,
    characterNFT,
    runAttackAction,
    mintCharacterNFTAction,
    handleSetCharacterNFT,
  };
};
