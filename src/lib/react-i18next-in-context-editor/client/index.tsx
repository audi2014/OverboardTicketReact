import { i18n, PostProcessorModule, TOptions } from 'i18next';
import React from 'react';

import { ClickToEditDetailsModeProps, ClickToEditModeProps } from './types';
import { Wrapper } from './Wrapper';

export type Props = {
  i18n: i18n;
  enabled?: boolean;
  clickToEditModeProps?: ClickToEditModeProps;
  clickToEditDetailsModeProps?: ClickToEditDetailsModeProps;
};

export const name = 'react-i18next-in-context-editor';

export const defaultProps = {
  enabled: true,
  clickToEditModeProps: {
    highlightClassName: `${name}-clickToEditModeProps-highlightClassName`,
    editableClassName: `${name}-clickToEditModeProps-editableClassName`,
    highlightStyle: {
      boxShadow: '0px 0px 4px 2px green',
    },
    editableStyle: {
      boxShadow: '0px 0px 4px 2px red',
    },
    hotKey: {
      shiftKey: true,
    },
  },
  clickToEditDetailsModeProps: {
    highlightClassName: `${name}-clickToEditDetailsModeProps-highlightClassName`,
    editableClassName: `${name}-clickToEditDetailsModeProps-editableClassName`,
    highlightStyle: {
      boxShadow: '0px 0px 4px 2px purple',
    },
    editableStyle: {
      boxShadow: '0px 0px 4px 0px fuchsia',
      position: 'absolute',
      background: 'white',
      width: '80%',
    },
    hotKey: {
      altKey: true,
    },
  },
} satisfies Omit<Props, 'i18n'>;

export class ReactI18nextInContextEditor implements PostProcessorModule {
  readonly type = 'postProcessor';
  readonly name = ReactI18nextInContextEditor.getName();
  private enabled: boolean;
  private readonly i18n: i18n;
  private readonly clickToEditModeProps?: ClickToEditModeProps;
  private readonly clickToEditDetailsModeProps?: ClickToEditDetailsModeProps;

  static getName() {
    return name;
  }

  constructor(props: {
    i18n: i18n;
    enabled?: boolean;
    clickToEditModeProps?: ClickToEditModeProps;
    clickToEditDetailsModeProps?: ClickToEditDetailsModeProps;
  }) {
    const mergedProps = { ...defaultProps, ...props };
    this.enabled = mergedProps.enabled;
    this.i18n = mergedProps.i18n;
    this.clickToEditModeProps = mergedProps.clickToEditModeProps;
    this.clickToEditDetailsModeProps = mergedProps.clickToEditDetailsModeProps;
  }

  process(value: string, keys: string, options: TOptions, translator: i18n) {
    const nsKey = String(Array.isArray(keys) ? keys[0] : keys);
    return (
      <Wrapper
        clickToEditModeProps={this.clickToEditModeProps}
        clickToEditDetailsModeProps={this.clickToEditDetailsModeProps}
        value={value}
        nsKey={nsKey}
        options={options}
        i18n={this.i18n}
      />
    ) as unknown as string;
  }
}
