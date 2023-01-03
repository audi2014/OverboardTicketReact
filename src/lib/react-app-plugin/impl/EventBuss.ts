import { EventBussInterface, SubscriptionType } from '../types/EventBussInterface';

export class EventBuss<EventData> implements EventBussInterface<EventData> {
  // dirty hack to store EventData generic type
  // constructor(readonly data: EventData) {}
  protected readonly subscriptions: Partial<
    Record<keyof EventData, SubscriptionType<EventData[keyof EventData]>[]>
  > = {};

  readonly listener = {
    on: <E extends keyof EventData>(
      event: E,
      subscription: SubscriptionType<EventData[E]>,
    ) => {
      if (!this.subscriptions[event]) this.subscriptions[event] = [];
      this.subscriptions?.[event]?.push(
        subscription as unknown as SubscriptionType<EventData[keyof EventData]>,
      );
      return () =>
        (this.subscriptions[event] = this.subscriptions[event]?.filter(
          (e) => e !== subscription,
        ));
    },
  };
  readonly publisher = {
    emit: async <E extends keyof EventData>(event: E, data: EventData[E]) => {
      if (!this.subscriptions?.[event]) return;
      for (const s of this.subscriptions[event] ?? []) {
        try {
          await s(data);
        } catch (e) {
          console.error(e);
        }
      }
    },
  };
}
