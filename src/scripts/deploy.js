// deploy.js
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['FUSHIGIDANE', 'HITOKAGE', 'ZENIGAME'],
    ['https://i.imgur.com/IjX49Yf.png', 'https://i.imgur.com/Xid5qaC.png', 'https://i.imgur.com/kW2dNCs.png'],
    [100, 200, 300],
    [100, 50, 25],
  );

  const nftGame = await gameContract.deployed();

  console.info('Contract deployed to:', nftGame.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.info('Minted NFT #1');

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.info('Minted NFT #2');

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.info('Minted NFT #3');

  console.info('Done deploying and minting!');
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.info(error);
    process.exit(1);
  }
};

runMain();
