import { CharacterType, FormattedCharacterType } from '@/types';

export const formatCharacterData = (characterData: CharacterType): FormattedCharacterType => {
  if (!characterData) return null;
  return {
    index: characterData.characterIndex.toNumber(),
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};
