import { ExternalStateType, PreloadedStateType } from './index';

export interface SerializerInterface {
  stringify(v: ExternalStateType): Promise<string>;
  parse(v: string): Promise<PreloadedStateType>;
}
