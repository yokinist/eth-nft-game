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

  console.debug({ mining });

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
              mining={mining}
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
