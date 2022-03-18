import { useGameContract } from '@/hooks';

type Props = Pick<ReturnType<typeof useGameContract>, 'characterNFT' | 'boss' | 'attackState' | 'runAttackAction'>;

export const Arena: React.VFC<Props> = ({ boss, characterNFT, attackState, runAttackAction }) => {
  return (
    <div>
      {/* ボス */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
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
        </div>
      )}
      {/* NFT キャラクター */}
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT?.name}</h2>
              <img src={characterNFT?.imageURI} alt={`Character ${characterNFT?.name}`} />
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
      </div>
    </div>
  );
};
