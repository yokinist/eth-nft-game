import { useMemo } from 'react';
import { Character, SelectCharacter } from '.';
import { useGameContract } from '@/hooks';
import { Button, Spinner } from '@/shared';
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
  const otherCharacters: FormattedCharacterType[] = useMemo(() => {
    if (!allCharacters.length) return [];
    return allCharacters.filter((character) => character?.index !== characterNFT?.index);
  }, [allCharacters, characterNFT?.index]);
  return (
    <div>
      {/* ボス */}
      {boss && characterNFT && (
        <div id="toast" className={showToast ? 'show' : ''}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>{boss && <Character character={boss} />}</div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
          </div>
          {attackState === 'attacking' && (
            <div className="loading-indicator">
              <Spinner loading theme="inline" />
              <p>Attacking...</p>
            </div>
          )}
        </div>
      )}
      {/* NFT キャラクター */}
      <div className="players-container">
        {characterNFT && <Character character={characterNFT} />}
        <div className="mt-8">
          <Button onClick={() => (characterNFT?.index ? giveBackCharacterNFT(characterNFT.index) : {})}>逃げる</Button>
        </div>
        <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">
            <SelectCharacter
              mining={mining}
              allCharacters={otherCharacters}
              mintCharacterNFTAction={mintCharacterNFTAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
