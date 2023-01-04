import { EventBussInterface } from '../types/EventBussInterface';
import { ObservableInterface } from '../types/ObservableInterface';

export class Observable<
  E extends string,
  V,
  EventData extends { [key in E]: V } = { [key in E]: V },
> implements ObservableInterface<V>
{
  readonly listener: ObservableInterface<V>['listener'];
  readonly publisher: ObservableInterface<V>['publisher'];
  constructor(
    protected value: V,
    protected readonly event: E,
    protected buss: EventBussInterface<EventData>,
  ) {
    this.listener = {
      on: (subscription) => this.buss.listener.on(this.event, subscription),
      getValue: () => this.value,
    };
    this.publisher = {
      update: async (value) => {
        this.value = value;
        return this.buss.publisher.emit(this.event, this.value as EventData[E]);
      },
    };
  }
}
