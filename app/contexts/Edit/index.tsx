'use client'

import { Blocks } from '@/lib/blocks/types'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Layout } from 'react-grid-layout'

type EditModeContextValue = {
  layout: Layout[]
  setLayout: (newLayout: Layout[]) => void
  draggingItem: any
  setDraggingItem: (newDraggingItem: any) => void
  selectedBlock: { id: string; type: Blocks } | null
  setSelectedBlock: ({ id, type }: { id: string; type: Blocks }) => void
}

const EditModeContext = createContext<EditModeContextValue | undefined>(
  undefined
)

export const useEditModeContext = (): EditModeContextValue => {
  const context = useContext(EditModeContext)

  if (!context) {
    throw new Error(
      'useEditModeContext must be used within a MyContextProvider'
    )
  }

  return context
}

export const EditModeContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<null | {
    id: string
    type: Blocks
  }>(null)
  const [draggingItem, setDraggingItem] = useState()
  const [layout, setLayout] = useState<Layout[]>([])

  const contextValue: EditModeContextValue = {
    layout,
    setLayout,
    draggingItem,
    setDraggingItem,
    selectedBlock,
    setSelectedBlock,
  }

  return (
    <EditModeContext.Provider value={contextValue}>
      {children}
    </EditModeContext.Provider>
  )
}
