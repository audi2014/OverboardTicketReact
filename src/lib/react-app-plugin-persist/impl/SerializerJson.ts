import { SerializerInterface } from '../types/SerializerInterface';

export class SerializerJson implements SerializerInterface {
  async parse(v: string) {
    return JSON.parse(v);
  }

  async stringify(v: Record<string, unknown>) {
    return JSON.stringify(v);
  }
}
