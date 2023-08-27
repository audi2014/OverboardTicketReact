import React from 'react';

import { ClickToEditModeProps } from './types';

export const EditableSpan = ({
  initialValue = '',
  clickToEditModeProps,
  onSubmit,
}: {
  initialValue: string;
  clickToEditModeProps?: ClickToEditModeProps;
  onSubmit: (value: string) => void;
}) => (
  <span
    suppressContentEditableWarning={true}
    className={clickToEditModeProps?.editableClassName}
    style={clickToEditModeProps?.editableStyle}
    contentEditable={true}
    onBlur={(e) => onSubmit(e.target.innerText)}
  >
    {initialValue || '<?>'}
  </span>
);
