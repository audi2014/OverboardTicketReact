import React, {
  ComponentType,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ContextValue } from './context.types';
import { PromiseFn, PropsType, StateType } from './index.types';

export const contextAsync = createContext<ContextValue>({
  blocker: Promise.resolve(),
});

export const Async = <TaskResult,>({
  wait = true,
  blockNext = true,
  blockChildren = true,
  promiseFn,
  ...rest
}: PropsType<TaskResult>) => {
  const context = useContext(contextAsync);
  const taskRef = useRef<PromiseFn<TaskResult>>();
  const cancelTaskPromiseRef = useRef<() => void>();
  const resolveNextRef = useRef<() => void>();
  const [state, setState] = useState<StateType<TaskResult>>({
    status: 'pending',
    lastResult: null,
  });

  useEffect(() => {
    taskRef.current = promiseFn;
    setState(({ lastResult }) => ({ status: 'pending', lastResult }));
    const blocker = context.blocker;
    context.blocker = new Promise<void>((resolveNext) => {
      resolveNextRef.current = resolveNext;
      (wait ? blocker : Promise.resolve()).then(() => {
        if (taskRef.current !== promiseFn) {
          // awaitFor didChange after finishing parent task - prevent start execution outdated task
          resolveNext();
          return;
        }
        if (!blockNext) {
          // start next task before finishing this component task
          resolveNext();
        }
        setState(({ lastResult }) => ({ status: 'progress', lastResult }));

        const taskPromise = promiseFn();
        cancelTaskPromiseRef.current = taskPromise.cancel;
        taskPromise
          .then((success) => {
            // awaitFor didChange after finishing component task - prevent rendering of outdated results
            if (taskRef.current !== promiseFn) {
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
            if (taskRef.current !== promiseFn) {
              return;
            }
            setState(({ lastResult }) => ({ error, status: 'error', lastResult }));
          })
          .finally(resolveNext);
      });
    });

    return () => {
      taskRef.current = undefined;
      // unblock blocked child tasks:
      resolveNextRef.current && resolveNextRef.current();
      setState(({ lastResult, status }) => {
        if (status === 'progress') {
          // if task already started - send cancel signal
          cancelTaskPromiseRef.current && cancelTaskPromiseRef.current();
        }
        return { status: 'pending', lastResult };
      });
    };
  }, [context, promiseFn, blockNext, wait]);

  let resultElements: JSX.Element | JSX.Element[] | undefined;

  if ('Render' in rest) {
    resultElements = <rest.Render {...state}>{rest.children}</rest.Render>;
  } else if (state.status === 'result' && 'children' in rest) {
    resultElements = (Array.isArray(rest.children) ? rest.children : [rest.children]).map(
      (E, key) => <E {...state} key={key} />,
    );
  }

  if (resultElements) {
    if (blockChildren) {
      return <>{resultElements}</>;
    }
    return (
      <contextAsync.Provider value={{ blocker: Promise.resolve() }}>
        {resultElements}
      </contextAsync.Provider>
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

export const AsyncRoot: ComponentType<PropsWithChildren> = ({ children }) => (
  <contextAsync.Provider value={{ blocker: Promise.resolve() }}>
    {children}
  </contextAsync.Provider>
);

export default Async;
