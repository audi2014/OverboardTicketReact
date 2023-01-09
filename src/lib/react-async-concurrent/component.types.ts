import { PropsWithChildren, ReactElement } from 'react';

import {
  ErrorPropsType,
  PendingPropsType,
  ProgressPropsType,
  ResultPropsType,
  StateType,
} from './index.types';

export type PendingComponentType<TaskResult> = (
  props: PendingPropsType<TaskResult>,
) => ReactElement;
export type ProgressComponentType<TaskResult> = (
  props: ProgressPropsType<TaskResult>,
) => ReactElement;
export type ErrorComponentType<TaskResult> = (
  props: ErrorPropsType<TaskResult>,
) => ReactElement;
export type ResultComponentType<TaskResult> = (
  props: ResultPropsType<TaskResult>,
) => ReactElement;
export type RenderComponentType<TaskResult> = (
  props: PropsWithChildren<StateType<TaskResult>>,
) => ReactElement;
