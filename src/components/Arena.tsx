import { IPFS_BASE_URL } from '@/constants';
import { useGameContract } from '@/hooks';
import { Spinner } from '@/shared';

type Props = Pick<
  ReturnType<typeof useGameContract>,
  'characterNFT' | 'boss' | 'attackState' | 'runAttackAction' | 'showToast'
>;

export const Arena: React.VFC<Props> = ({ boss, showToast, characterNFT, attackState, runAttackAction }) => {
  console.debug({ attackState });
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
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={`${IPFS_BASE_URL}/${boss.imageURI}`} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
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
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT?.name}</h2>
              <img src={`${IPFS_BASE_URL}/${characterNFT?.imageURI}`} alt={`Character ${characterNFT?.name}`} />
              <div className="health-bar">
                <progress value={characterNFT?.hp} max={characterNFT?.maxHp} />
                <p>{`${characterNFT?.hp} / ${characterNFT?.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT?.attackDamage}`}</h4>
            </div>
          </div>
        </div>
        {/* <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">{renderActivePlayersList()}</div>
        </div> */}
      </div>
    </div>
  );
};
