import React, { createContext, ReactElement, useMemo, useState } from 'react';

type CandyContextType = {
  refetch: any;
};

export const CandyContext = createContext<CandyContextType>({
  refetch: undefined
});

type CandyActionContextType = {
  setRefetch: React.Dispatch<any>;
};

export const CandyActionContext = createContext<CandyActionContextType>({
  setRefetch: () => console.log('no setRefetch')
});

interface CandyProp {
  children: ReactElement;
}

export const CandyProvider: React.FC<CandyProp> = ({ children }) => {
  const [refetch, setRefetch] = useState<any>();
  console.log('REFRESH NFT');
  const actions = useMemo(() => ({ setRefetch }), []);

  return (
    <CandyContext.Provider value={{ refetch }}>
      <CandyActionContext.Provider value={actions}>
        {children}
      </CandyActionContext.Provider>
    </CandyContext.Provider>
  );
};
