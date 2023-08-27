import { CSSProperties, useRef } from 'react';

export const EditDetails = ({
  values,
  pathWithoutKey,
  language,
  ns,
  style,
  className,
  onClose,
  onSubmit,
}: {
  values: Record<string, string>;
  pathWithoutKey: string;
  language: string;
  ns: string;
  style?: CSSProperties;
  className?: string;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}) => {
  const ref = useRef<(HTMLTextAreaElement | null)[]>([]);
  ref.current = [];
  const handleSave = () => {
    onSubmit(
      Object.fromEntries(ref.current.map((e) => [e?.id, e?.value] as [string, string])),
    );
  };
  return (
    <div style={style} className={className}>
      <button onClick={onClose}>close</button>
      <button onClick={handleSave}>save</button>
      <p>{[language, ns, pathWithoutKey].join('/')}</p>
      {Object.entries(values).map(([k, v]) => (
        <>
          <p>{k}</p>
          <textarea id={k} ref={(e) => ref.current.push(e)} key={k} defaultValue={v} />
        </>
      ))}
    </div>
  );
};
