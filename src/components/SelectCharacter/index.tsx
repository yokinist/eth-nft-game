import { useGameContract } from '@/hooks';

type Props = Pick<ReturnType<typeof useGameContract>, 'allCharacters' | 'handleSetCharacterNFT'>;

export const SelectCharacter: React.VFC<Props> = ({ allCharacters }) => {
  const renderCharacters = () =>
    allCharacters.map((character, index) => (
      <div className="character-item" key={character?.name}>
        <div className="name-container">
          <p>{character?.name}</p>
        </div>
        <img src={character?.imageURI} alt={character?.name} />
        <button
          type="button"
          className="character-mint-button"
          //onClick={mintCharacterNFTAction(index)}
        >{`Mint ${character?.name}`}</button>
      </div>
    ));
  return (
    <div className="select-character-container">
      <h2>一緒に戦う NFT キャラクターを選択</h2>
      {allCharacters.length && <div className="character-grid">{renderCharacters()}</div>}
    </div>
  );
};
