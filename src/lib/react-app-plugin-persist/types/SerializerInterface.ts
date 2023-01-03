export interface SerializerInterface<V = Record<string, unknown>> {
  stringify(v: V): Promise<string>;
  parse(v: string): Promise<V>;
}
