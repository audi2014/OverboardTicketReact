import { AsyncRoot } from 'lib/react-async-concurrent';
import React, { useEffect } from 'react';

import { makeAsyncTest, MakeChildrenElements } from './makeAsyncTest';

/// TESTS -----------------

const makeChildrenElements: MakeChildrenElements = ({
  count,
  chCount,
  ms,
  awaited,
  asyncStart,
  asyncChildren,
  alwaysShowChildren,
}) =>
  new Array(chCount).fill(null).map((_, index) => (
    <AsyncTestAlwaysShowChildren
      key={index}
      initialValues={{
        count: count * 10 + index,
        chCount: 0,
        ms,
        awaited,
        asyncStart,
        asyncChildren,
        alwaysShowChildren,
      }}
    />
  ));

const AsyncTestAlwaysShowChildren = makeAsyncTest({
  makeChildrenElements,
});

export const ReactAsyncConcurrentDemo = () => (
  <>
    <h1>alwaysShowChildren</h1>
    <AsyncRoot>
      <AsyncTestAlwaysShowChildren initialValues={{ count: 2, chCount: 2 }} />
    </AsyncRoot>
  </>
);
