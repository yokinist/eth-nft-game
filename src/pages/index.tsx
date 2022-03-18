import { SelectCharacter } from '@/components';
import { useWallet, useGameContract } from '@/hooks';
import { Button, Layout } from '@/shared';

type Props = {
  //
};

const Page: React.VFC<Props> = ({}) => {
  const { currentAccount, isRinkebyTestNetwork, connectWallet } = useWallet();

  const { allCharacters, handleSetCharacterNFT } = useGameContract({
    enable: !!(isRinkebyTestNetwork && currentAccount),
  });

  const renderSomethingBeforeConnectWallet = () => {
    return (
      <Button theme="primary" onClick={connectWallet}>
        Connect Wallet
      </Button>
    );
  };

  const renderSomethingAfterConnectWallet = () => {
    return (
      <div className="flex items-center">
        {!isRinkebyTestNetwork ? (
          <p>Please Switch Rinkeby Test Network</p>
        ) : (
          <>
            <SelectCharacter handleSetCharacterNFT={handleSetCharacterNFT} allCharacters={allCharacters} />
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Layout>{currentAccount ? renderSomethingAfterConnectWallet() : renderSomethingBeforeConnectWallet()}</Layout>
    </>
  );
};

export default Page;
