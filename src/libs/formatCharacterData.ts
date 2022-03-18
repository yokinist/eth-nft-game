import { CharacterType, FormattedCharacterType } from '@/types';

export const formatCharacterData = (characterData: CharacterType): FormattedCharacterType | null => {
  if (!characterData) return null;
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};
