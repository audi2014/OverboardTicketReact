import { EventBussInterface } from '../types/EventBussInterface';
import { ObservableInterface } from '../types/ObservableInterface';

export class Observable<
  EventData extends { [key: string]: unknown },
  E extends keyof EventData = keyof EventData,
  V extends EventData[E] = EventData[E],
> implements ObservableInterface<EventData, E, V>
{
  readonly listener: ObservableInterface<EventData, E, V>['listener'];
  readonly publisher: ObservableInterface<EventData, E, V>['publisher'];
  constructor(
    protected value: V,
    protected readonly event: E,
    protected buss: EventBussInterface<EventData>,
  ) {
    this.listener = {
      on: this.buss.listener.on,
      getValue: () => this.value,
    };
    this.publisher = {
      emit: this.buss.publisher.emit,
      setValue: async (value) => {
        this.value = value;
        return this.buss.publisher.emit(this.event, this.value);
      },
    };
  }
}
