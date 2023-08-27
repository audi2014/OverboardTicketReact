import React from 'react';

import { KeyBinding } from './useKeyBinding';

export type ClickToEditModeProps = {
  hotKey?: KeyBinding;
  highlightStyle?: React.CSSProperties;
  highlightClassName?: string;
  editableStyle?: React.CSSProperties;
  editableClassName?: string;
};

export type ClickToEditDetailsModeProps = ClickToEditModeProps;
