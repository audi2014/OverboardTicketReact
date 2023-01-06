import React, {
  ComponentType,
  createContext,
  LazyExoticComponent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export const FlatWrapper: ComponentType<PropsWithChildren> = ({ children }) => {
  const [count, setCount] = useState(0);
  // useEffect(() => {
  //   const i = setInterval(() => setCount((v) => v + 1), 200);
  //   return () => clearInterval(i);
  // }, []);
  return (
    <fieldset>
      {count}
      <>{count % 2 === 0 ? children : <h3>odd</h3>}</>
    </fieldset>
  );
};

const asyncGuardContext = createContext<{
  promise: Promise<unknown>;
}>({
  promise: Promise.resolve(),
});

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
  const taskRef = useRef(task);
  const errorRef = useRef<unknown>();
  const successRef = useRef<TaskResult>();
  const [status, setStatus] = useState<'pending' | 'progress' | 'error' | 'success'>(
    'pending',
  );
  useEffect(() => {
    errorRef.current = undefined;
    successRef.current = undefined;
    ctx.promise = ctx.promise
      .then(() => {
        setStatus('progress');
        return taskRef.current();
      })
      .then((success) => {
        console.log('task done', success);
        successRef.current = success;
        errorRef.current = undefined;
        setStatus('success');
      })
      .catch((error) => {
        successRef.current = undefined;
        errorRef.current = error;
        setStatus('error');
      });
  }, [ctx]);

  if (status === 'success') {
    const array = Array.isArray(children) ? children : [children];
    return (
      <>
        {array.map((e, key) => (
          <React.Fragment key={key}>
            {successRef.current && e(successRef.current)}
          </React.Fragment>
        ))}
      </>
    );
  }
  if (status === 'error') {
    if (onError) return onError(errorRef.current);
    throw errorRef.current;
  }
  if (status === 'pending') return (onPending && onPending()) || null;
  if (status === 'progress') return (onProgress && onProgress()) || null;

  return null;
};

/// TESTS -----------------
const delay = <T,>(ms = 500, v?: T) => new Promise((r) => setTimeout(() => r(v), ms));

const AsyncGuardTest: React.ComponentType<PropsWithChildren<{ lvl: number }>> = ({
  lvl,
  children,
}) => {
  return (
    <fieldset>
      <p>{lvl}</p>
      <AsyncGuard
        task={() => delay(1500).then(() => `${lvl}`)}
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
                <>{children}</>
              </>
            );
          },
        ]}
      </AsyncGuard>
    </fieldset>
  );
};

export const test = (
  <FlatWrapper>
    <AsyncGuardTest lvl={11}></AsyncGuardTest>
    <AsyncGuardTest lvl={12}>
      <AsyncGuardTest lvl={121}>
        <AsyncGuardTest lvl={1211}></AsyncGuardTest>
        <AsyncGuardTest lvl={1212}></AsyncGuardTest>
      </AsyncGuardTest>
      <AsyncGuardTest lvl={122}></AsyncGuardTest>
    </AsyncGuardTest>
    <AsyncGuardTest lvl={13}></AsyncGuardTest>
    <AsyncGuardTest lvl={14}>
      <AsyncGuardTest lvl={141}>
        <AsyncGuardTest lvl={1411}></AsyncGuardTest>
        <AsyncGuardTest lvl={1412}></AsyncGuardTest>
      </AsyncGuardTest>
      <AsyncGuardTest lvl={142}></AsyncGuardTest>
    </AsyncGuardTest>
    <AsyncGuardTest lvl={15}></AsyncGuardTest>
  </FlatWrapper>
);
