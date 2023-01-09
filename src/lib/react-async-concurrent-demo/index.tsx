import { AsyncRoot, contextAsync } from 'lib/react-async-concurrent';
import React from 'react';

import { makeAsyncTest, MakeChildrenElements } from './makeAsyncTest';
import { makeRenderComponent } from './makeRenderComponent';

/// TESTS -----------------

const makeChildrenElements: MakeChildrenElements = ({
  result,
  chCount,
  ms,
  wait,
  blockNext,
  blockChildren,
}) =>
  new Array(chCount).fill(null).map((_, index) => (
    <AsyncTestDynamic
      key={index}
      initialValues={{
        ms: 1000,
        result: result * 10 + index,
        wait,
        blockNext,
        blockChildren,
      }}
    />
  ));

const AsyncTestDynamic = makeAsyncTest({
  Render: makeRenderComponent({ alwaysShowChildren: true }),
  makeChildrenElements,
});

const AsyncTestStatic = makeAsyncTest({
  Render: makeRenderComponent({ alwaysShowChildren: false }),
  makeChildrenElements,
});

export const ReactAsyncConcurrentDemo = () => (
  <>
    <h1>hide children before result</h1>
    <AsyncRoot>
      <AsyncTestStatic initialValues={{ result: 1, ms: 1000, chCount: 3 }}>
        <AsyncTestStatic initialValues={{ result: 2, ms: 1000, chCount: 1 }} />
      </AsyncTestStatic>
    </AsyncRoot>

    <h1>alwaysShowChildren</h1>
    <AsyncRoot>
      <AsyncTestDynamic initialValues={{ chCount: 2 }} />
    </AsyncRoot>
  </>
);
