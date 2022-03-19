import { Arena, SelectCharacter } from '@/components';
import { useWallet, useGameContract } from '@/hooks';
import { Button, Layout, Spinner } from '@/shared';

type Props = {
  //
};

const Page: React.VFC<Props> = ({}) => {
  const { currentAccount, isRinkebyTestNetwork, connectWallet } = useWallet();

  const {
    isLoading,
    mining,
    healing,
    showToast,
    boss,
    attackState,
    runAttackAction,
    healCharacterHP,
    characterNFT,
    allCharacters,
    mintCharacterNFTAction,
  } = useGameContract({
    enable: !!(isRinkebyTestNetwork && currentAccount),
  });

  const renderSomethingBeforeConnectWallet = () => {
    return (
      <Button theme="primary" onClick={connectWallet}>
        Connect Wallet
      </Button>
    );
  };

  if (!currentAccount) return <Layout>{renderSomethingBeforeConnectWallet()}</Layout>;

  if (!isRinkebyTestNetwork)
    return (
      <Layout>
        <p>Please Switch Rinkeby Test Network</p>
      </Layout>
    );

  if (isLoading) {
    return (
      <Layout>
        <Spinner loading theme="screen" />
      </Layout>
    );
  }

  return (
    <div className="bg-color-object-secondary min-h-screen">
      <Layout>
        <div className="flex items-center">
          {characterNFT ? (
            <Arena
              showToast={showToast}
              characterNFT={characterNFT}
              boss={boss}
              attackState={attackState}
              runAttackAction={runAttackAction}
              allCharacters={allCharacters}
              mining={mining}
              healing={healing}
              mintCharacterNFTAction={mintCharacterNFTAction}
              healCharacterHP={healCharacterHP}
            />
          ) : (
            <SelectCharacter
              mining={mining}
              allCharacters={allCharacters}
              mintCharacterNFTAction={mintCharacterNFTAction}
            />
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Page;
