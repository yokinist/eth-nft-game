const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['FUSHIGIDANE', 'HITOKAGE', 'ZENIGAME'], // name
    ['https://i.imgur.com/IjX49Yf.png', 'https://i.imgur.com/Xid5qaC.png', 'https://i.imgur.com/kW2dNCs.png'], // image
    [100, 200, 300], // hp
    [100, 50, 25], // attack
    'MYU2', // Boss name
    'https://i.imgur.com/3Ikh51a.png', // Boss image
    10000, // Boss hp
    50, // Boss attack
  );
  await gameContract.deployed();
  console.info('Contract deployed to:', gameContract.address);
  let txn;
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  // 1回目の攻撃: attackBoss 関数を追加
  txn = await gameContract.attackBoss();
  await txn.wait();

  // 2回目の攻撃: attackBoss 関数を追加
  txn = await gameContract.attackBoss();
  await txn.wait();

  // NFTのURIの値を取得
  let returnedTokenUri = await gameContract.tokenURI(1);
  console.info('Token URI:', returnedTokenUri);
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
