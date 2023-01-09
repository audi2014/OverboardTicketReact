import { PropsWithChildren } from 'react';

import {
  ErrorComponentType,
  PendingComponentType,
  ProgressComponentType,
  RenderComponentType,
  ResultComponentType,
} from './component.types';

export type LastResultType<TaskResult> = {
  lastResult: TaskResult | null;
};
export type PendingPropsType<TaskResult> = {
  status: 'pending';
} & LastResultType<TaskResult>;
export type ProgressPropsType<TaskResult> = {
  status: 'progress';
} & LastResultType<TaskResult>;
export type ErrorPropsType<TaskResult> = {
  error: unknown;
  status: 'error';
} & LastResultType<TaskResult>;
export type ResultPropsType<TaskResult> = {
  result: TaskResult;
  status: 'result';
} & LastResultType<TaskResult>;

export type StateType<TaskResult> = (
  | PendingPropsType<TaskResult>
  | ProgressPropsType<TaskResult>
  | ErrorPropsType<TaskResult>
  | ResultPropsType<TaskResult>
) &
  LastResultType<TaskResult>;

export type PromiseFn<TaskResult> = () => Promise<TaskResult> & { cancel?: () => void };

export type ConfigPropsType = {
  wait: boolean;
  blockNext: boolean;
  blockChildren: boolean;
};

export type PropsType<TaskResult> = {
  promiseFn: PromiseFn<TaskResult>;
} & Partial<ConfigPropsType> &
  (
    | PropsWithChildren<{
        Render: RenderComponentType<TaskResult>;
      }>
    | {
        Pending?: PendingComponentType<TaskResult>;
        Progress?: ProgressComponentType<TaskResult>;
        Error?: ErrorComponentType<TaskResult>;
        children: ResultComponentType<TaskResult> | ResultComponentType<TaskResult>[];
      }
  );
