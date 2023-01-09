import React, {
  ComponentType,
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export const FlatWrapper: ComponentType<PropsWithChildren> = ({ children }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const i = setInterval(() => {
      setCount((v) => v + 1);
    }, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <fieldset>
      {count}
      <>{children}</>
    </fieldset>
  );
};

type ContextPromiseResult = void;
type ContextPromise = Promise<ContextPromiseResult>;
type ContextValue = {
  blocker: ContextPromise;
};
type ConfigPropsType = {
  wait?: boolean;
  blockNext?: boolean;
  blockChildren?: boolean;
};
type ChildType<TaskResult> = (props: { result: TaskResult }) => ReactElement;
type PropsType<TaskResult> = ConfigPropsType & {
  task: () => Promise<TaskResult>;
  Pending?: () => ReactElement;
  Progress?: () => ReactElement;
  Error?: (props: { error: unknown }) => ReactElement;
  children: ChildType<TaskResult> | ChildType<TaskResult>[];
};

const context = createContext<ContextValue>({
  blocker: Promise.resolve(),
});

const Async = <TaskResult,>({
  wait = true,
  blockNext = true,
  blockChildren = true,
  task,
  Pending,
  Progress,
  Error,
  children,
}: PropsType<TaskResult>) => {
  const ctx = useContext(context);
  const taskRef = useRef<typeof task | null>(null);
  const [state, setState] = useState<
    | {
        error: unknown;
      }
    | {
        result: TaskResult;
      }
    | 'pending'
    | 'progress'
  >('pending');

  useEffect(() => {
    taskRef.current = task;
    setState('pending');
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
        setState('progress');
        task()
          .then((success) => {
            // awaitFor didChange after finishing component task - prevent rendering of outdated results
            if (taskRef.current !== task) {
              return;
            }
            setState({ result: success });
          })
          .catch((error) => {
            // awaitFor didChange after finishing component task - prevent rendering of outdated results
            if (taskRef.current !== task) {
              return;
            }
            setState({ error });
          })
          .finally(resolveNext);
      });
    });

    return () => {
      taskRef.current = null;
    };
  }, [ctx, task, blockNext, wait]);

  if (state === 'progress') {
    return (Progress && <Progress />) || null;
  }
  if (state === 'pending') {
    return (Pending && <Pending />) || null;
  }
  if ('result' in state) {
    const array = Array.isArray(children) ? children : [children];

    const resultElements = array.map((E, key) => <E result={state.result} key={key} />);
    if (blockChildren) {
      return <>{resultElements}</>;
    }
    return (
      <context.Provider value={{ blocker: Promise.resolve() }}>
        {resultElements}
      </context.Provider>
    );
  }
  if ('error' in state) {
    if (Error) return <Error error={state.error} />;
    throw state.error;
  }

  return null;
};

/// TESTS -----------------
const delay = <T,>(v?: T, ms = 1000) => new Promise((r) => setTimeout(() => r(v), ms));

const Result = ({ result }: { result: number }) => {
  return <p style={{ color: 'red' }}>Result: {result}</p>;
};

const Test: React.ComponentType<
  {
    ms: number;
    parentCount: number;
    children?: ((v: number) => JSX.Element)[];
  } & ConfigPropsType
> = ({
  //
  ms,
  parentCount,
  children = [],
  ...configProps
}) => {
  const [count, setCount] = useState(parentCount);
  const task = useCallback(
    () =>
      delay(count, ms).then(() => {
        console.log(`task.done: count: ${count} ms: ${ms}`);
        return count;
      }),
    [count, ms],
  );
  return (
    <fieldset>
      <button onClick={() => setCount((v) => v + 1)}>{count}</button>
      <Async
        {...configProps}
        task={task}
        Error={({ error }) => <p>{String(error)}</p>}
        Pending={() => <p style={{ color: 'gray' }}>Pending...</p>}
        Progress={() => <p style={{ color: 'blue' }}>Progress...</p>}
      >
        {[
          //
          Result,
          ({ result }) => (
            <>
              {children.map((ch, key) => (
                <React.Fragment key={key}>{ch(result * 10)}</React.Fragment>
              ))}
            </>
          ),
        ]}
      </Async>
    </fieldset>
  );
};

const ms1 = 1000;
const ms2 = 2000;

export const test = (
  <FlatWrapper>
    <Test parentCount={1} ms={ms1}>
      {[
        //
        (prev) => <Test parentCount={prev + 1} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 2} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 3} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 4} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 5} ms={ms2}></Test>,
      ]}
    </Test>
    <Test parentCount={1} ms={ms1}>
      {[
        //
        (prev) => <Test parentCount={prev + 1} ms={ms2} />,
        (prev) => <Test parentCount={prev + 2} ms={ms2} />,
        (prev) => <Test parentCount={prev + 3} ms={ms2} />,
      ]}
    </Test>
  </FlatWrapper>
);
