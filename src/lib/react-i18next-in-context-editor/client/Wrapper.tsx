import { i18n, TOptions } from 'i18next';
import React, { ComponentType, useState } from 'react';

import { patchResValue } from './api';
import { EditableSpan } from './EditableSpan';
import { EditDetails } from './EditDetails';
import { HighlightSpan } from './HighlightSpan';
import { ClickToEditDetailsModeProps, ClickToEditModeProps } from './types';
import { useKeyBinding } from './useKeyBinding';
import { parseNsKey } from './utils';

const PLURALS = ['zero', 'singular', 'two', 'few', 'many', 'other'];

export const Wrapper: ComponentType<{
  value: string;
  nsKey: string;
  options: TOptions;
  i18n: i18n;
  clickToEditModeProps?: ClickToEditModeProps;
  clickToEditDetailsModeProps?: ClickToEditDetailsModeProps;
}> = ({
  value,
  nsKey,
  options,
  i18n,
  clickToEditModeProps,
  clickToEditDetailsModeProps,
}) => {
  const [edit, setEdit] = useState<{
    values: Record<string, string>;
    mode: 'edit' | 'editDetails';
  }>();
  const highlightEdit = useKeyBinding(clickToEditModeProps?.hotKey);
  const highlightEditDetails = useKeyBinding(clickToEditDetailsModeProps?.hotKey);

  const valueOrFallback = value || '<?>';
  const language = i18n.language;
  const { ns, pathWithoutKey, key } = parseNsKey(
    nsKey,
    i18n.options?.nsSeparator,
    i18n.options?.keySeparator,
    options.ns || i18n?.options?.defaultNS,
  );

  const handleSave = (patch: Record<string, string>) => {
    patchResValue({
      path: pathWithoutKey,
      ns,
      language,
      patch,
    }).then(async () => {
      // i18n.reloadResources is not working :0
      i18n.init();
      setEdit(undefined);
    });
  };
  const handleHighLightClick = () => {
    const pluralEntries = PLURALS.map(
      (pk) =>
        [`${key}_${pk}`, i18n.getResource(language, ns, `${key}_${pk}`) as string] as [
          string,
          string | unknown,
        ],
    ).filter(([, v]) => typeof v === 'string');
    const entries = [
      [key, String(i18n.getResource(language, ns, key) || '')],
      ...pluralEntries,
    ];
    setEdit({
      values: Object.fromEntries(entries),
      mode: entries.length > 1 || highlightEditDetails ? 'editDetails' : 'edit',
    });
  };

  if (edit && edit.mode === 'editDetails') {
    return (
      <EditDetails
        language={language}
        ns={ns}
        pathWithoutKey={pathWithoutKey}
        values={edit.values}
        style={clickToEditDetailsModeProps?.editableStyle}
        className={clickToEditDetailsModeProps?.editableClassName}
        onClose={() => setEdit(undefined)}
        onSubmit={handleSave}
      />
    );
  } else if (edit && edit.mode === 'edit') {
    const [k, v] = Object.entries(edit.values)[0];
    return (
      <EditableSpan
        initialValue={v}
        clickToEditModeProps={clickToEditModeProps}
        onSubmit={(v) => handleSave({ [k]: v })}
      />
    );
  } else if (highlightEditDetails) {
    return (
      <HighlightSpan
        value={valueOrFallback}
        className={clickToEditDetailsModeProps?.highlightClassName}
        style={clickToEditDetailsModeProps?.highlightStyle}
        onClick={handleHighLightClick}
      />
    );
  } else if (highlightEdit) {
    return (
      <HighlightSpan
        value={valueOrFallback}
        className={clickToEditModeProps?.highlightClassName}
        style={clickToEditModeProps?.highlightStyle}
        onClick={handleHighLightClick}
      />
    );
  } else {
    return <>{value}</>;
  }
};
