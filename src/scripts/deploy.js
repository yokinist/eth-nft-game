// deploy.js
const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('EpicGame');
  const gameContract = await gameContractFactory.deploy(
    ['MAGIC GHOST', 'HUNGRYTIGER', 'FUN GHOST'], // name
    [
      'https://lh3.googleusercontent.com/ZJH91320EmRzo4ERs9hntz-_sjmm9T_2OGbxi5TlGVfdDuHyi0ppbrqHb2gRCuI2tLRQ0OxWLxEYgvZfnRLoICPbS85jkvqG2tdBtqY=w600',
      'https://lh3.googleusercontent.com/cOhJTa6eGdZX9p66A_sn-TOlO6CbAdg3XtW0zl1wAVVWK1Kb-FyDlnfnWChgbrnumSbFXuhFYxrsKrN_N4OoIxRrSX0774fC7sJtpns=w600',
      'https://lh3.googleusercontent.com/pYcxo3P7u9uzwvO-sDCtCfXvD2gnJ1R0YcpG61tgpJr9T-01kii44P4i4yodAfzSrww1HDTgEwktrMUnk2zvtFYxfPJ1-fn6WUbq0Q=w600',
    ], // image
    [100, 200, 300], // hp
    [100, 50, 25], // attack
    'SkullBoss', // Boss name
    'https://lh3.googleusercontent.com/BgV3kMvoZ5JPjTT-n3cDMdUA7f8zhp3oonWoR4TL4koDcF5mCC7UlFP_C1G2kPaOjiOjAGuV6eL_FMDaLmmVdJmLHBRHnhsPAEzvKQ=w600', // Boss image
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
