import React, {
  createContext,
  Fragment,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type LastResultType<TaskResult> = {
  lastResult: TaskResult | null;
};
type PendingPropsType<TaskResult> = {
  status: 'pending';
} & LastResultType<TaskResult>;
type ProgressPropsType<TaskResult> = {
  status: 'progress';
} & LastResultType<TaskResult>;
type ErrorPropsType<TaskResult> = {
  error: unknown;
  status: 'error';
} & LastResultType<TaskResult>;
type ResultPropsType<TaskResult> = {
  result: TaskResult;
  status: 'result';
} & LastResultType<TaskResult>;
type StateType<TaskResult> = (
  | PendingPropsType<TaskResult>
  | ProgressPropsType<TaskResult>
  | ErrorPropsType<TaskResult>
  | ResultPropsType<TaskResult>
) &
  LastResultType<TaskResult>;

type PendingComponentType<TaskResult> = (
  props: PendingPropsType<TaskResult>,
) => ReactElement;
type ProgressComponentType<TaskResult> = (
  props: ProgressPropsType<TaskResult>,
) => ReactElement;
type ErrorComponentType<TaskResult> = (props: ErrorPropsType<TaskResult>) => ReactElement;
type ResultComponentType<TaskResult> = (
  props: ResultPropsType<TaskResult>,
) => ReactElement;
type RenderComponentType<TaskResult> = (props: StateType<TaskResult>) => ReactElement;

type ConfigPropsType = {
  wait: boolean;
  blockNext: boolean;
  blockChildren: boolean;
};
type PropsType<TaskResult> = {
  task: () => Promise<TaskResult> & { cancel?: () => void }; // TODO
} & Partial<ConfigPropsType> &
  (
    | {
        Children: RenderComponentType<TaskResult> | RenderComponentType<TaskResult>[];
      }
    | {
        Pending?: PendingComponentType<TaskResult>;
        Progress?: ProgressComponentType<TaskResult>;
        Error?: ErrorComponentType<TaskResult>;
        children: ResultComponentType<TaskResult> | ResultComponentType<TaskResult>[];
      }
  );

type ContextPromiseResult = void;
type ContextPromise = Promise<ContextPromiseResult>;
type ContextValue = {
  blocker: ContextPromise;
};
const context = createContext<ContextValue>({
  blocker: Promise.resolve(),
});

const Async = <TaskResult,>({
  wait = true,
  blockNext = true,
  blockChildren = true,
  task,
  ...rest
}: PropsType<TaskResult>) => {
  const ctx = useContext(context);
  const taskRef = useRef<typeof task | null>(null);
  const [state, setState] = useState<StateType<TaskResult>>({
    status: 'pending',
    lastResult: null,
  });

  useEffect(() => {
    taskRef.current = task;
    setState(({ lastResult }) => ({ status: 'pending', lastResult }));
    const blocker = ctx.blocker;
    ctx.blocker = new Promise<void>((resolveNext) => {
      (wait ? blocker : Promise.resolve()).then(() => {
        if (taskRef.current !== task) {
          // awaitFor didChange after finishing parent task - prevent start execution outdated task
          resolveNext();
          return;
        }
        if (!blockNext) {
          // start next task before finishing this component task
          resolveNext();
        }
        setState(({ lastResult }) => ({ status: 'progress', lastResult }));
        task()
          .then((success) => {
            // awaitFor didChange after finishing component task - prevent rendering of outdated results
            if (taskRef.current !== task) {
              return;
            }
            setState({
              result: success,
              status: 'result',
              lastResult: success,
            });
          })
          .catch((error) => {
            // awaitFor didChange after finishing component task - prevent rendering of outdated results
            if (taskRef.current !== task) {
              return;
            }
            setState(({ lastResult }) => ({ error, status: 'error', lastResult }));
          })
          .finally(resolveNext);
      });
    });

    return () => {
      taskRef.current = null;
    };
  }, [ctx, task, blockNext, wait]);

  let resultElements: JSX.Element[] | undefined;

  if ('Children' in rest) {
    resultElements = (Array.isArray(rest.Children) ? rest.Children : [rest.Children]).map(
      (E, key) => <E {...state} key={key} />,
    );
  }

  if (state.status === 'result' && 'children' in rest) {
    resultElements = (Array.isArray(rest.children) ? rest.children : [rest.children]).map(
      (E, key) => <E {...state} key={key} />,
    );
  }

  if (resultElements) {
    if (blockChildren) {
      return <>{resultElements}</>;
    }
    return (
      <context.Provider value={{ blocker: Promise.resolve() }}>
        {resultElements}
      </context.Provider>
    );
  }

  if (state.status === 'pending') {
    return ('Pending' in rest && rest.Pending && <rest.Pending {...state} />) || null;
  }

  if (state.status === 'progress') {
    return ('Progress' in rest && rest.Progress && <rest.Progress {...state} />) || null;
  }

  if ('error' in state) {
    if ('Error' in rest && rest.Error) return <rest.Error {...state} />;
    throw state.error;
  }

  return null;
};

/// TESTS -----------------
const delay = <T,>(v?: T, ms = 1000) => new Promise((r) => setTimeout(() => r(v), ms));

const AsyncTest: React.ComponentType<{
  initialValues: {
    ms: number;
    result: number;
    children: number;
  } & ConfigPropsType;
}> = ({
  //
  initialValues,
}) => {
  const [ms, setMs] = useState(initialValues.ms);
  const [children, setChildren] = useState(initialValues.children);
  const [wait, setWait] = useState(initialValues.wait);
  const [blockNext, setBlockNext] = useState(initialValues.blockNext);
  const [blockChildren, setBlockChildren] = useState(initialValues.blockChildren);

  const [result, setResult] = useState(initialValues.result);
  const task = useCallback(() => delay(result, ms).then(() => result * 10), [result, ms]);
  return (
    <fieldset>
      <p>
        <span>
          <input
            style={{ width: 60 }}
            title={'ms'}
            type={'number'}
            min={0}
            step={500}
            value={ms}
            onChange={(e) => setMs(+e.target.value)}
          />
          {' ms; '}
        </span>
        <span>
          <input
            style={{ width: 40 }}
            type={'number'}
            min={0}
            step={1}
            value={children}
            onChange={(e) => setChildren(+e.target.value)}
          />
          {' children; '}
        </span>
        <span>
          <input
            type={'checkbox'}
            checked={wait}
            onChange={(e) => setWait(e.target.checked)}
          />
          {' wait; '}
        </span>
        <span>
          <input
            type={'checkbox'}
            checked={blockNext}
            onChange={(e) => setBlockNext(e.target.checked)}
          />
          {' blockNext; '}
        </span>
        <span>
          <input
            type={'checkbox'}
            checked={blockChildren}
            onChange={(e) => setBlockChildren(e.target.checked)}
          />
          {' blockChildren; '}
        </span>
      </p>
      <p>
        <input
          type={'number'}
          value={result}
          onChange={(e) => setResult(+e.target.value)}
        />
        x 10 = ...
      </p>
      <Async
        task={task}
        wait={wait}
        blockNext={blockNext}
        blockChildren={blockChildren}
        Children={(state) => {
          const result = state.status === 'result' ? state.result : state.lastResult;
          const resultElement = result ? (
            <>
              <p style={{ color: 'green' }}>Result: {result}</p>
              {...new Array(children).fill(null).map((_, index) => (
                <AsyncTest
                  key={index}
                  initialValues={{
                    result: result + 1,
                    ms,
                    children: 0,
                    wait,
                    blockNext,
                    blockChildren,
                  }}
                />
              ))}
            </>
          ) : null;

          const errorElement =
            state.status === 'error' ? (
              <p style={{ color: 'red' }}>{String(state.error)}</p>
            ) : null;

          const progressElement =
            state.status === 'progress' ? (
              <p style={{ color: 'blue' }}>Progress...</p>
            ) : null;
          const pendingElement =
            state.status === 'pending' ? (
              <p style={{ color: 'gray' }}>Pending...</p>
            ) : null;

          return (
            <>
              {pendingElement}
              {progressElement}
              {errorElement}
              {resultElement}
            </>
          );
        }}
      />
    </fieldset>
  );
};

export const test = (
  <Fragment>
    <AsyncTest
      initialValues={{
        result: 1,
        ms: 1000,
        children: 3,
        wait: true,
        blockChildren: true,
        blockNext: true,
      }}
    />
  </Fragment>
);
