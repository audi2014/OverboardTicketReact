import { I18NextExample } from 'integration/i18next/I18NextExample';
import { I18NextLocizeExample } from 'integration/i18next-locize/I18NextLocizeExample';
import { ReduxExample } from 'integration/redux/features/example/Counter';

let renders = 0;
export const App = () => {
  return (
    <fieldset>
      <h3>App; renders: {++renders}</h3>
      <ReduxExample />
      <I18NextExample />
      <I18NextLocizeExample />
    </fieldset>
  );
};
