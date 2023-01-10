import { PropsWithChildren } from 'react';

import {
  RenderAnyType,
  RenderErrorType,
  RenderPendingType,
  RenderProgressType,
  RenderResultType,
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

export type ConfigPropsType = {
  asyncStart: boolean;
  asyncChildren: boolean;
  awaited: boolean;
};

export type PromiseFn<TaskResult> = () => Promise<TaskResult> & { cancel?: () => void };

export type PropsType<TaskResult> = {
  promiseFn: PromiseFn<TaskResult>;
} & Partial<ConfigPropsType> &
  (
    | {
        // FaCC or Function as a Child Component:
        children: RenderAnyType<TaskResult>;
      }
    | {
        // Render props:
        renderPending?: RenderPendingType<TaskResult>;
        renderProgress?: RenderProgressType<TaskResult>;
        renderError?: RenderErrorType<TaskResult>;
        renderResult: RenderResultType<TaskResult>;
      }
  );
