import React, {
  ComponentType,
  createContext,
  LazyExoticComponent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

const asyncGuardContext = createContext<{
  promise: Promise<unknown>;
}>({
  promise: Promise.resolve(),
});

const Cancel = Symbol('AsyncGuard Cancel');

const AsyncGuard = <TaskResult,>({
  task,
  children,
  onPending,
  onProgress,
  onError,
}: {
  task: () => Promise<TaskResult>;
  children: ((v: TaskResult) => ReactElement)[] | ((v: TaskResult) => ReactElement);
  onPending?: () => ReactElement;
  onProgress?: () => ReactElement;
  onError?: (error: unknown) => ReactElement;
} & (
  | {
      children: (v: TaskResult) => ReactElement;
    }
  | {
      children: ((v: TaskResult) => ReactElement)[];
    }
)) => {
  const ctx = useContext(asyncGuardContext);
  const progressPromiseCancelRef =
    useRef<(v: typeof Cancel | PromiseLike<typeof Cancel>) => void>();
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
    console.log('pending', task.debug);
    setState('pending');
    ctx.promise = ctx.promise
      .then((r) => {
        setState('progress');
        return new Promise<TaskResult | typeof Cancel>((resolve) => {
          progressPromiseCancelRef.current = resolve;
          task().then(resolve);
        });
      })
      .then((success) => {
        if (success === Cancel) {
          return ['canceled', task.debug];
        }
        setState({ result: success });
        return ['success ' + success, task.debug];
      })
      .catch((error) => {
        setState({ error });
        return ['error ' + error, task.debug];
      });

    return () => {
      console.log('task canceling...', task.debug);
      if (progressPromiseCancelRef.current) {
        setState('pending');
        progressPromiseCancelRef.current(Cancel);
      }
    };
  }, [ctx, task]);

  if (state === 'progress') {
    return (onProgress && onProgress()) || null;
  }
  if (state === 'pending') {
    return (onPending && onPending()) || null;
  }
  if ('result' in state) {
    const array = Array.isArray(children) ? children : [children];
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

const AsyncGuardTest: React.ComponentType<{
  ms: number;
  parentCount: number;
  children: ((v: number) => JSX.Element)[];
}> = ({ ms, parentCount, children }) => {
  const [count, setCount] = useState(parentCount);
  const task = useCallback(() => delay(count, ms).then(() => count), [count, ms]);
  task.debug = `ms:${ms}, count:${count}`;
  return (
    <fieldset>
      <p>parentCount: {parentCount}</p>
      <button onClick={() => setCount((v) => v + 1)}>{count}</button>
      <AsyncGuard
        task={task}
        onError={(error) => <p>{String(error)}</p>}
        onPending={() => <p style={{ color: 'gray' }}>Pending...</p>}
        onProgress={() => <p style={{ color: 'blue' }}>Progress...</p>}
      >
        {[
          //
          (r) => {
            return (
              <>
                <p style={{ color: 'green' }}>Result: {r}</p>
              </>
            );
          },
          (r) => (
            <>
              {children.map((ch, key) => (
                <React.Fragment key={key}>{ch(r * 10)}</React.Fragment>
              ))}
            </>
          ),
        ]}
      </AsyncGuard>
    </fieldset>
  );
};

export const test = (
  <FlatWrapper>
    <AsyncGuardTest parentCount={1} ms={1000}>
      {[
        //
        (prev) => (
          <AsyncGuardTest parentCount={prev + 1} ms={5000}>
            {[
              //
              (r) => <p style={{ color: 'red' }}>Final Result: {r}</p>,
            ]}
          </AsyncGuardTest>
        ),
        //
        (prev) => (
          <AsyncGuardTest parentCount={prev + 2} ms={5000}>
            {[
              //
              (r) => <p style={{ color: 'red' }}>Final Result: {r}</p>,
            ]}
          </AsyncGuardTest>
        ),
        (prev) => (
          <AsyncGuardTest parentCount={prev + 3} ms={5000}>
            {[
              //
              (r) => <p style={{ color: 'red' }}>Final Result: {r}</p>,
            ]}
          </AsyncGuardTest>
        ),
      ]}
    </AsyncGuardTest>
  </FlatWrapper>
);
