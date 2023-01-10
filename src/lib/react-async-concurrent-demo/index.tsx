import { AsyncRoot } from 'lib/react-async-concurrent';
import React from 'react';

import { makeAsyncTest, MakeChildrenElements } from './makeAsyncTest';

/// TESTS -----------------

const makeChildrenElements: MakeChildrenElements = ({
  count,
  chCount,
  ms,
  awaited,
  asyncStart,
  asyncChildren,
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
      }}
    />
  ));

const AsyncTestStatic = makeAsyncTest({
  alwaysShowChildren: false,
  makeChildrenElements: null,
});

const AsyncTestAlwaysShowChildren = makeAsyncTest({
  alwaysShowChildren: true,
  makeChildrenElements,
});

export const ReactAsyncConcurrentDemo = () => (
  <>
    <h1>Static</h1>
    <AsyncRoot>
      <AsyncTestStatic initialValues={{ count: 1, ms: 1000, chCount: 3 }}>
        <AsyncTestStatic initialValues={{ count: 10, ms: 1000, chCount: 1 }} />
        <AsyncTestStatic initialValues={{ count: 11, ms: 1000, chCount: 1 }} />
        <AsyncTestStatic initialValues={{ count: 12, ms: 1000, chCount: 1 }} />
      </AsyncTestStatic>
      <AsyncTestStatic initialValues={{ count: 1, ms: 1000, chCount: 3 }}>
        <AsyncTestStatic initialValues={{ count: 10, ms: 1000, chCount: 1 }} />
        <AsyncTestStatic initialValues={{ count: 11, ms: 1000, chCount: 1 }} />
        <AsyncTestStatic initialValues={{ count: 12, ms: 1000, chCount: 1 }} />
      </AsyncTestStatic>
    </AsyncRoot>

    <h1>alwaysShowChildren</h1>
    <AsyncRoot>
      <AsyncTestAlwaysShowChildren initialValues={{ count: 2, chCount: 2 }} />
    </AsyncRoot>
  </>
);
