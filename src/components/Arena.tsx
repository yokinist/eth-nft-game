import { useMemo, useState } from 'react';
import { Character, SelectCharacter } from '.';
import { useGameContract } from '@/hooks';
import { Spinner } from '@/shared';
import { FormattedCharacterType } from '@/types';

type Props = Pick<
  ReturnType<typeof useGameContract>,
  | 'characterNFT'
  | 'boss'
  | 'attackState'
  | 'runAttackAction'
  | 'showToast'
  | 'giveBackCharacterNFT'
  | 'allCharacters'
  | 'mining'
  | 'mintCharacterNFTAction'
>;

export const Arena: React.VFC<Props> = ({
  mining,
  boss,
  showToast,
  allCharacters,
  characterNFT,
  attackState,
  runAttackAction,
  giveBackCharacterNFT,
  mintCharacterNFTAction,
}) => {
  const [isShowCharacters, setIsShowCharacters] = useState<boolean>(false);

  const otherCharacters: FormattedCharacterType[] = useMemo(() => {
    if (!allCharacters.length) return [];
    return allCharacters.filter((character) => character?.index !== characterNFT?.index);
  }, [allCharacters, characterNFT?.index]);
  return (
    <div className="w-full">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? 'show' : ''}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}
      <div className="flex justify-end w-full">
        {boss && (
          <div className="boss-container">
            <div className={`boss-content ${attackState}`}>{boss && <Character character={boss} />}</div>
          </div>
        )}
      </div>
      <div className="flex w-full">
        {/* NFT キャラクター */}
        <div className="w-full max-w-sm">
          <div className="players-container w-full">{characterNFT && <Character character={characterNFT} />}</div>
          <div className="flex">
            <div className="attack-container mb-4 mr-4">
              <button className="cta-button" onClick={runAttackAction}>
                💥 攻撃する
              </button>
            </div>
            <div className="attack-container">
              <button className="cta-button" onClick={() => setIsShowCharacters((prevState) => !prevState)}>
                {isShowCharacters ? 'キャンセル' : ' 仲間を呼ぶ'}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full">
          {isShowCharacters && (
            <div className="active-players w-full">
              <div className="flex items-center max-w-3xl">
                <SelectCharacter
                  mining={mining}
                  allCharacters={otherCharacters}
                  mintCharacterNFTAction={mintCharacterNFTAction}
                  type="join"
                />
              </div>
            </div>
          )}
          {attackState === 'attacking' && (
            <div className="loading-indicator">
              <Spinner loading theme="inline" />
              <p>Attacking...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
