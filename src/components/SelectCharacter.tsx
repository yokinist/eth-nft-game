import { Character } from '.';
import { useGameContract } from '@/hooks';

type Props = Pick<ReturnType<typeof useGameContract>, 'allCharacters' | 'mintCharacterNFTAction' | 'mining'> & {
  type?: 'join' | 'new';
};

export const SelectCharacter: React.VFC<Props> = ({ type = 'new', mining, allCharacters, mintCharacterNFTAction }) => {
  const renderCharacters = () =>
    allCharacters.map((character) => (
      <Character
        key={character.index}
        mintCharacterNFTAction={mintCharacterNFTAction}
        character={character}
        type={type}
      />
    ));
  return (
    <div className="select-character-container mt-12">
      {type === 'new' && <h2 className="mb-16">一緒に戦う NFT キャラクターを選択</h2>}
      {mining ? (
        <div className="loading">
          <img
            src="https://media3.giphy.com/media/38niYp6E83GwM/giphy.gif?cid=ecf05e472ik1qhtc9zgpg3gpcuegk9mmzmzj3uyqxsfamui4&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
            className="mb-4 border-2 solid border-color-object-white rounded"
          />
          <p className="text-color-object-white font-bold text-lg">召喚中...</p>
        </div>
      ) : (
        <>{allCharacters.length && <div className="character-grid">{renderCharacters()}</div>}</>
      )}
    </div>
  );
};
