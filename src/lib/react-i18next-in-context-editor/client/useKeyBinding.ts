import React, { useEffect, useState } from 'react';

type KeyboardEventKeys = Pick<
  KeyboardEvent,
  | 'altKey'
  | 'code'
  | 'charCode'
  | 'ctrlKey'
  | 'isComposing'
  | 'key'
  | 'location'
  | 'metaKey'
  | 'repeat'
  | 'shiftKey'
>;

export type KeyBinding = Partial<KeyboardEventKeys>;

const isKeyBindingPressed = (e: KeyboardEvent, b?: KeyBinding) =>
  Object.entries(b || {}).every(([k, v]) => {
    return e[k as keyof KeyboardEvent] === v;
  });
export const useKeyBinding = (b?: KeyBinding) => {
  const ref = React.useRef(b);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setOn(isKeyBindingPressed(e, ref.current));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setOn(isKeyBindingPressed(e, ref.current));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  return on;
};
