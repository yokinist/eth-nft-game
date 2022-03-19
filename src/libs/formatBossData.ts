import { BossType, FormattedBossType } from '@/types';

export const formatBossData = (bossData: BossType): FormattedBossType => {
  return {
    name: bossData.name,
    imageURI: bossData.imageURI,
    hp: bossData.hp.toNumber(),
    maxHp: bossData.maxHp.toNumber(),
    attackDamage: bossData.attackDamage.toNumber(),
  };
};
