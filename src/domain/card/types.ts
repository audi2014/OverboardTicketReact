import { CARD_TYPES, CHARACTERS, PROVISION } from './constants';

export type CardType = typeof CARD_TYPES[number];
export type CharacterType = typeof CHARACTERS[number];
export type ProvisionType = typeof PROVISION[number];

export type AssetsContextValue = {
  CHARACTER: Record<CharacterType, string>;
  HATE: Record<CharacterType, string>;
  LOVE: Record<CharacterType, string>;
  PROVISION: Record<ProvisionType, string>;
  NAVIGATION: {
    TEMPLATE: string;
    FIGHT: string;
    OARS: string;
  };
  PLACEHOLDER: Record<CardType, string>;
};
