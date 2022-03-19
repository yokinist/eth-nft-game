import { IPFS_BASE_URL } from '@/constants';
import { useGameContract } from '@/hooks';
import { Spinner } from '@/shared';

type Props = Pick<ReturnType<typeof useGameContract>, 'allCharacters' | 'mintCharacterNFTAction' | 'mining'>;

export const SelectCharacter: React.VFC<Props> = ({ mining, allCharacters, mintCharacterNFTAction }) => {
  const renderCharacters = () =>
    allCharacters.map((character, index) => (
      <div className="character-item" key={character?.name}>
        <div className="name-container">
          <p>{character?.name}</p>
        </div>
        <img src={`${IPFS_BASE_URL}/${character?.imageURI}`} alt={character?.name} />
        <button
          type="button"
          className="character-mint-button"
          // @ts-ignore
          onClick={mintCharacterNFTAction(index)}
        >{`Mint ${character?.name}`}</button>
      </div>
    ));
  return (
    <div className="select-character-container">
      <h2>一緒に戦う NFT キャラクターを選択</h2>
      {mining && (
        <div className="loading">
          <div className="indicator">
            <Spinner loading />
            <p>Minting In Progress...</p>
          </div>
          <img
            src="https://media3.giphy.com/media/38niYp6E83GwM/giphy.gif?cid=ecf05e472ik1qhtc9zgpg3gpcuegk9mmzmzj3uyqxsfamui4&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
      {allCharacters.length && <div className="character-grid">{renderCharacters()}</div>}
    </div>
  );
};
