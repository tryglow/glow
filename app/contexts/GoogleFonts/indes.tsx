'use client';

import { allFonts } from '@/lib/google-fonts';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';


type GoogleFontsContextValue = {
  googleFonts: any,
  setGoogleFonts: any
};

const GoogleFontsContext = createContext<GoogleFontsContextValue | undefined>(
  undefined
);

export const useGoogleFontsContext = (): GoogleFontsContextValue => {
  const context = useContext(GoogleFontsContext);

  if (!context) {
    throw new Error(
      'useGoogleFontsContext must be used within a GoogleFontsContextProvider'
    );
  }

  return context;
};

export const GoogleFontsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [googleFonts, setGoogleFonts] = useState([]);

  const contextValue: GoogleFontsContextValue = {
    googleFonts,
    setGoogleFonts
  };

  useEffect(() => {
    googleFonts?.length === 0 && getGoogleFonts()
  }, [])
  
  const getGoogleFonts = async () => {
    const resp = await allFonts();
    setGoogleFonts(resp?.items);
  }

  

  return (
    <GoogleFontsContext.Provider value={contextValue}>
      {children}
    </GoogleFontsContext.Provider>
  );
};
