export interface StateControllerInterface<State = Record<string, unknown>> {
  getState(): Promise<State>;
  setState(state: Partial<State>): Promise<void>;
}
