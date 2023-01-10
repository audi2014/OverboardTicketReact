import { ReactElement } from 'react';

import {
  ErrorPropsType,
  PendingPropsType,
  ProgressPropsType,
  ResultPropsType,
  StateType,
} from './index.types';

export type RenderReturnType = ReactElement | null;

export type RenderPendingType<TaskResult> = (
  props: PendingPropsType<TaskResult>,
) => RenderReturnType;
export type RenderProgressType<TaskResult> = (
  props: ProgressPropsType<TaskResult>,
) => RenderReturnType;
export type RenderErrorType<TaskResult> = (
  props: ErrorPropsType<TaskResult>,
) => RenderReturnType;
export type RenderResultType<TaskResult> = (
  props: ResultPropsType<TaskResult>,
) => RenderReturnType;
export type RenderAnyType<TaskResult> = (
  props: StateType<TaskResult>,
) => RenderReturnType;
