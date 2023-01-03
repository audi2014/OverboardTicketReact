import { EventBussInterface } from './EventBussInterface';

export interface ObservableInterface<
  EventData extends { [key: string]: unknown },
  E extends keyof EventData = keyof EventData,
  V extends EventData[E] = EventData[E],
> extends EventBussInterface<EventData> {
  readonly listener: {
    on: EventBussInterface<EventData>['listener']['on'];
    getValue(): V;
  };

  readonly publisher: {
    emit: EventBussInterface<EventData>['publisher']['emit'];
    setValue(value: V): Promise<void>;
  };
}
