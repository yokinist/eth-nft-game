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
    boss,
    attackState,
    runAttackAction,
    characterNFT,
    allCharacters,
    handleSetCharacterNFT,
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
        <Spinner loading />
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="flex items-center">
          {characterNFT ? (
            <Arena
              characterNFT={characterNFT}
              boss={boss}
              attackState={attackState}
              runAttackAction={runAttackAction}
            />
          ) : (
            <SelectCharacter
              handleSetCharacterNFT={handleSetCharacterNFT}
              allCharacters={allCharacters}
              mintCharacterNFTAction={mintCharacterNFTAction}
            />
          )}
        </div>
      </Layout>
    </>
  );
};

export default Page;
