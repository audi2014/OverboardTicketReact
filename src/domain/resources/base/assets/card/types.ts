import { CardType, CharacterType, ProvisionType } from 'domain/card/types';

interface IDXCardBase {
  placeholder: string;
}
interface IDXCardCharacter extends IDXCardBase {
  bg: Record<CharacterType, string>;
}
interface IDXCardProvision extends IDXCardBase {
  bg: Record<ProvisionType, string>;
}
interface IDXCardNavigation extends IDXCardBase {
  bg: string;
  fight: string;
  oars: string;
}
export interface IDXCardRoot extends Record<CardType, IDXCardBase> {
  character: IDXCardCharacter;
  role: IDXCardCharacter;
  hate: IDXCardCharacter;
  love: IDXCardCharacter;
  provision: IDXCardProvision;
  navigation: IDXCardNavigation;
}
