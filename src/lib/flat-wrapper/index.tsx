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
  next: ContextPromise;
};
type ConfigPropsType = {
  waitForPrev?: boolean;
  blockNext?: boolean;
  blockChildren?: boolean;
};
type PropsType<TaskResult> = ConfigPropsType & {
  awaitFor: () => Promise<TaskResult>;
  children: ((v: TaskResult) => ReactElement)[] | ((v: TaskResult) => ReactElement);
  onPending?: () => ReactElement;
  onProgress?: () => ReactElement;
  onError?: (error: unknown) => ReactElement;
};

const context = createContext<ContextValue>({
  next: Promise.resolve(),
});

const Async = <TaskResult,>({
  waitForPrev = true,
  blockNext = true,
  blockChildren = true,
  awaitFor,
  children,
  onPending,
  onProgress,
  onError,
}: PropsType<TaskResult> &
  (
    | {
        children: (v: TaskResult) => ReactElement;
      }
    | {
        children: ((v: TaskResult) => ReactElement)[];
      }
  )) => {
  const ctx = useContext(context);
  const awaitForRef = useRef<typeof awaitFor | null>(null);
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
    awaitForRef.current = awaitFor;
    setState('pending');
    const prevPromise = ctx.next;
    ctx.next = new Promise<void>((resolveNext) => {
      (waitForPrev ? prevPromise : Promise.resolve()).then(() => {
        if (awaitForRef.current !== awaitFor) {
          // awaitFor didChange after finishing parent task - prevent start execution outdated task
          resolveNext();
          return;
        }
        if (!blockNext) {
          // start next task before finishing this component task
          resolveNext();
        }
        setState('progress');
        awaitFor()
          .then((success) => {
            // awaitFor didChange after finishing component task - prevent rendering of outdated results
            if (awaitForRef.current !== awaitFor) {
              return;
            }
            setState({ result: success });
          })
          .catch((error) => {
            // awaitFor didChange after finishing component task - prevent rendering of outdated results
            if (awaitForRef.current !== awaitFor) {
              return;
            }
            setState({ error });
          })
          .finally(resolveNext);
      });
    });

    return () => {
      awaitForRef.current = null;
    };
  }, [ctx, awaitFor, blockNext, waitForPrev]);

  if (state === 'progress') {
    return (onProgress && onProgress()) || null;
  }
  if (state === 'pending') {
    return (onPending && onPending()) || null;
  }
  if ('result' in state) {
    const array = Array.isArray(children) ? children : [children];
    if (!blockChildren) {
      return (
        <context.Provider value={{ next: Promise.resolve() }}>
          {array.map((e, key) => (
            <React.Fragment key={key}>{e(state.result)}</React.Fragment>
          ))}
        </context.Provider>
      );
    }
    return (
      <>
        {array.map((e, key) => (
          <React.Fragment key={key}>{e(state.result)}</React.Fragment>
        ))}
      </>
    );
  }
  if ('error' in state) {
    if (onError) return onError(state.error);
    throw state.error;
  }

  return null;
};

/// TESTS -----------------
const delay = <T,>(v?: T, ms = 1000) => new Promise((r) => setTimeout(() => r(v), ms));

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
        awaitFor={task}
        onError={(error) => <p>{String(error)}</p>}
        onPending={() => <p style={{ color: 'gray' }}>Pending...</p>}
        onProgress={() => <p style={{ color: 'blue' }}>Progress...</p>}
      >
        {[
          //
          (r) => <p style={{ color: 'red' }}>Result: {r}</p>,
          (r) => (
            <>
              {children.map((ch, key) => (
                <React.Fragment key={key}>{ch(r * 10)}</React.Fragment>
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
        (prev) => <Test blockNext={false} parentCount={prev + 1} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 2} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 3} ms={ms2}></Test>,
        (prev) => <Test waitForPrev={false} parentCount={prev + 4} ms={ms2}></Test>,
        (prev) => <Test parentCount={prev + 5} ms={ms2}></Test>,
      ]}
    </Test>
    <Test parentCount={1} ms={ms1} blockChildren={false} waitForPrev={false}>
      {[
        //
        (prev) => <Test parentCount={prev + 1} ms={ms2} />,
        (prev) => <Test parentCount={prev + 2} ms={ms2} />,
        (prev) => <Test parentCount={prev + 3} ms={ms2} />,
      ]}
    </Test>
  </FlatWrapper>
);
