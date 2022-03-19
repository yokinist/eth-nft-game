import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Character, SelectCharacter } from '.';
import { useGameContract } from '@/hooks';
import { FormattedCharacterType } from '@/types';

type Props = Pick<
  ReturnType<typeof useGameContract>,
  | 'characterNFT'
  | 'boss'
  | 'attackState'
  | 'runAttackAction'
  | 'healCharacterHP'
  | 'showToast'
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
  healCharacterHP,
  runAttackAction,
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
        <div className="w-full">
          <div className="players-container w-full max-w-sm">
            {characterNFT && <Character character={characterNFT} />}
          </div>
          <div className="flex w-full">
            <div className="attack-container mb-4 mr-4 flex flex-wrap">
              <button className="cta-button m-2" onClick={runAttackAction}>
                💥 攻撃する
              </button>
              <button className="cta-button m-2" onClick={healCharacterHP}>
                🌿 回復する
              </button>
              <button className="cta-button m-2" onClick={() => setIsShowCharacters((prevState) => !prevState)}>
                {isShowCharacters ? 'キャンセル' : '♻️ 交代する'}
              </button>
              <button
                className="cta-button m-2"
                onClick={() => toast('残念ながら実装されていません..😭', { icon: '🚧' })}
              >
                🏃‍♂️ 逃げる
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
              <img
                alt="attacking"
                src="https://media4.giphy.com/media/l0ExsgrTuACbtPaqQ/giphy.gif?cid=ecf05e476lon48nbj98mmuurecfeoqbxbe9cdjit2auk6h2q&rid=giphy.gif&ct=g"
                className="w-56 h-56 rounded-full"
                decoding="async"
              />
              <p className="text-color-object-empty pl-20 text-lg">攻撃中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
