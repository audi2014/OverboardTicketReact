import { ExternalStateType, PreloadedStateType } from '../types';
import { SerializerInterface } from '../types/SerializerInterface';

export class SerializerJson implements SerializerInterface {
  async parse(v: string): Promise<PreloadedStateType> {
    return JSON.parse(v);
  }

  async stringify(v: ExternalStateType): Promise<string> {
    return JSON.stringify(v);
  }
}
