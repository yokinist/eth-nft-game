// deploy.js
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

  const nftGame = await gameContract.deployed();

  console.info('Contract deployed to:', nftGame.address);
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
