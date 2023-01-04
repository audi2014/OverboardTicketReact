import { SubscriptionType, UnsubscribeType } from './EventBussInterface';

export interface ObservableInterface<V> {
  readonly listener: {
    on(subscription: SubscriptionType<V>): UnsubscribeType;
    getValue(): V;
  };

  readonly publisher: {
    update(value: V): Promise<void>;
  };
}
