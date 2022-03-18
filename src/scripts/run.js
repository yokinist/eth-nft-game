const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['FUSHIGIDANE', 'HITOKAGE', 'ZENIGAME'], // 名前
    [
      'https://i.imgur.com/IjX49Yf.png', // 画像
      'https://i.imgur.com/Xid5qaC.png',
      'https://i.imgur.com/kW2dNCs.png',
    ],
    [100, 200, 300], // HP
    [100, 50, 25], // 攻撃力
  );
  await gameContract.deployed();
  console.info('Contract deployed to:', gameContract.address);
  let txn;
  txn = await gameContract.mintCharacterNFT(2);
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
