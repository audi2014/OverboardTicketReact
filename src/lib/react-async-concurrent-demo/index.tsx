import { AsyncRoot } from 'lib/react-async-concurrent';
import { AsyncTest } from 'lib/react-async-concurrent-demo/AsyncTest';
import React, { useEffect } from 'react';

export const ReactAsyncConcurrentDemo = () => (
  <>
    <h1>alwaysShowChildren</h1>
    <AsyncRoot>
      <AsyncTest initialValues={{ count: 2, chCount: 2 }} />
    </AsyncRoot>
  </>
);
