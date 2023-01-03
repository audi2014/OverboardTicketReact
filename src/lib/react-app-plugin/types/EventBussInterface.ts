export type UnsubscribeType = () => void;

export type SubscriptionType<Data> = (e: Data) => Promise<void> | void;

export interface EventBussInterface<EventData> {
  listener: {
    on<E extends keyof EventData>(
      event: E,
      subscription: SubscriptionType<EventData[E]>,
    ): UnsubscribeType;
  };
  publisher: {
    emit<E extends keyof EventData>(event: E, data: EventData[E]): Promise<void>;
  };
}
