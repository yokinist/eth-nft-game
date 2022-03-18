const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['MAGIC GHOST', 'HUNGRYTIGER', 'FUN GHOST'], // name
    [
      'QmdzHEPiZaQzxLiZUqNJz2FcAtBcQZBJYwhQoqiECLhvPX',
      'QmQ1UMzvxnT29Yhnnk6fPd6fa8RF3pFKKwwDJ6JYrB4eSD',
      'QmTv7bv5HAGo4iu9r6ecHi2mv7APsREosomSrjGE1KU8wu',
    ], // image
    [100, 200, 300], // hp
    [100, 50, 25], // attack
    'SkullBoss', // Boss name
    'QmZU5inBKzotoU3xXPV8fc93YnniYsSaGu5iuK7VLqKCMR', // Boss image
    10000, // Boss hp
    50, // Boss attack
  );
  await gameContract.deployed();
  console.info('Contract deployed to:', gameContract.address);
  let txn;
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  // 1回目の攻撃
  txn = await gameContract.attackBoss();
  await txn.wait();

  // 2回目の攻撃
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
