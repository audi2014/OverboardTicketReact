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
  onError,
}: {
  task: () => Promise<TaskResult>;
  children: ((v: TaskResult) => ReactElement)[] | ((v: TaskResult) => ReactElement);
  onPending?: () => ReactElement;
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
  const errorRef = useRef<unknown>();
  const successRef = useRef<TaskResult>();
  const [status, setStatus] = useState<'pending' | 'error' | 'success'>('pending');
  useEffect(() => {
    setStatus('pending');
    errorRef.current = undefined;
    successRef.current = undefined;
    ctx.promise = ctx.promise
      .then(() => task())
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
  }, []);

  if (status === 'success') {
    // bug wait for all pending childrens
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
  } else if (status === 'error' && onError) return onError(errorRef.current);
  else if (status === 'error') throw errorRef.current;
  else if (onPending) return onPending();
  else return null;
};

/// TESTS -----------------
const delay = <T,>(ms = 1000, v?: T) => new Promise((r) => setTimeout(() => r(v), ms));

const AsyncGuardTest: React.ComponentType<PropsWithChildren<{ lvl: number }>> = ({
  lvl,
  children,
}) => {
  return (
    <fieldset>
      <p>Parent Result: {lvl}</p>
      <AsyncGuard
        task={() => delay(1500).then(() => `${lvl}`)}
        onError={(error) => <p>{String(error)}</p>}
        onPending={() => <p style={{ color: 'gray' }}>Loading... lvl={lvl}</p>}
      >
        {[
          //
          (r) => {
            console.log('mag', r);
            return (
              <>
                <p>Result: {r}</p>
              </>
            );
          },
          (r) => {
            return (
              <>
                <p>Result: {r}</p>
                {children}
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
    <AsyncGuardTest lvl={1.1}></AsyncGuardTest>
    <AsyncGuardTest lvl={1.2}>
      <AsyncGuardTest lvl={2.1}>
        <AsyncGuardTest lvl={3.1}></AsyncGuardTest>
        <AsyncGuardTest lvl={3.2}></AsyncGuardTest>
      </AsyncGuardTest>
      <AsyncGuardTest lvl={2.2}></AsyncGuardTest>
    </AsyncGuardTest>
    <AsyncGuardTest lvl={1.3}></AsyncGuardTest>
    <AsyncGuardTest lvl={1.4}>
      <AsyncGuardTest lvl={2.2}>
        <AsyncGuardTest lvl={3.3}></AsyncGuardTest>
        <AsyncGuardTest lvl={3.4}></AsyncGuardTest>
      </AsyncGuardTest>
      <AsyncGuardTest lvl={2.3}></AsyncGuardTest>
    </AsyncGuardTest>
    <AsyncGuardTest lvl={1.5}></AsyncGuardTest>
  </FlatWrapper>
);
