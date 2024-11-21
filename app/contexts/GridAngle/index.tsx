'use client'
import React, { createContext, useContext, useState } from 'react'

export interface GridAngleProps {
  angle: any;
  setAngle: (args: any) => void
}

const GridAngle = createContext<GridAngleProps | undefined>(undefined);

export const useGridAngleContext = (): any => {
  const context = useContext(GridAngle);

  if (!context) {
    throw new Error(
      'useGridAngleContext must be used within a EditModeContextProvider'
    );
  }

  return context;
};

export const GridAngleProvider = ({children}: {children: React.ReactNode}) => {
  const [angle, setAngle] = useState(0)
  
  const contextValue: GridAngleProps = {
    angle,
    setAngle
  }
  
  return (
    <GridAngle.Provider value={contextValue}>
      {children}
    </GridAngle.Provider>
  )
}

export default GridAngleProvider