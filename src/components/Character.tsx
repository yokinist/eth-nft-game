import classNames from 'classnames';
import { IPFS_BASE_URL } from '@/constants';
import { useGameContract } from '@/hooks';
import { FormattedBossType, FormattedCharacterType } from '@/types';

type Props = {
  character: FormattedCharacterType | FormattedBossType;
  type?: 'join' | 'new';
  mintCharacterNFTAction?: ReturnType<typeof useGameContract>['mintCharacterNFTAction'];
};

export const Character: React.VFC<Props> = ({ mintCharacterNFTAction, character, type = 'new' }) => {
  return (
    <div className="character-item">
      <div
        className={classNames('name-container text-color-object-white', {
          'bg-color-sub-blue-default': 'index' in character,
          'bg-color-danger-default': !('index' in character),
        })}
      >
        <p>{character.name}</p>
      </div>
      <img src={`${IPFS_BASE_URL}/${character.imageURI}`} alt={character.name} />
      {mintCharacterNFTAction && 'index' in character ? (
        //  @ts-ignore
        <button type="button" className="character-mint-button" onClick={mintCharacterNFTAction(character.index)}>
          {type === 'new' ? '君に決めた' : '交代する'}
        </button>
      ) : (
        <div className="relative">
          <div className="health-bar">
            <progress value={character.hp} max={character.maxHp} />
            <p>{`${character.hp} / ${character.maxHp} HP`}</p>
          </div>
          <div className="stats">
            <h4>{`⚔️ Attack Damage: ${character.attackDamage}`}</h4>
          </div>
        </div>
      )}
    </div>
  );
};
