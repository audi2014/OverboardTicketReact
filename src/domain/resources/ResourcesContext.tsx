import { Resources } from 'domain/resources/base/types';
import { getResources } from 'domain/resources/getResources';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

export const resourcesContext = createContext<Resources>(null as unknown as Resources);

export const ResourcesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [r, setR] = useState<Resources>();
  useEffect(() => {
    getResources().then(setR);
  });
  if (!r) return <h1>Loading Resources...</h1>;
  return <resourcesContext.Provider value={r}>{children}</resourcesContext.Provider>;
};

export const useResources = () => useContext(resourcesContext);
