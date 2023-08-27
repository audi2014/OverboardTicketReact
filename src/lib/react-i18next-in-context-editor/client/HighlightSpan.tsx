import React from 'react';

export const HighlightSpan = ({
  value,
  className,
  style,
  onClick,
}: {
  value: string;
  style?: React.CSSProperties;
  className?: string;
  onClick: () => void;
}) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <span
    className={className}
    style={style}
    tabIndex={0}
    role={'button'}
    onClick={onClick}
  >
    {value}
  </span>
);
