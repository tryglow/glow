import {ReactNode, createContext, useContext, useState} from 'react';
import {Layout} from 'react-grid-layout';

type EditModeContextValue = {
  isEditingEnabled: boolean;
  toggleEditingEnabled: (newValue: boolean) => void;
  isResizingEnabled: boolean;
  toggleResizingEnabled: (newValue: boolean) => void;
  layout: Layout[];
  setLayout: (newLayout: Layout[]) => void;
  draggingItem: any;
  setDraggingItem: (newDraggingItem: any) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (newSelectedSectionId: string | null) => void;
};

const EditModeContext = createContext<EditModeContextValue | undefined>(
  undefined
);

export const useEditModeContext = (): EditModeContextValue => {
  const context = useContext(EditModeContext);

  if (!context) {
    throw new Error(
      'useEditModeContext must be used within a MyContextProvider'
    );
  }

  return context;
};

export const EditModeContextProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [isEditingEnabled, setIsEditingEnabled] = useState<boolean>(false);
  const [isResizingEnabled, setIsResizingEnabled] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<null | string>(
    null
  );
  const [draggingItem, setDraggingItem] = useState();
  const [layout, setLayout] = useState<Layout[]>([]);

  const toggleEditingEnabled = (newValue: boolean) => {
    if (newValue && process.env.NODE_ENV === 'development') {
      console.log('Editing enabled');
    }

    setIsEditingEnabled(newValue);
  };

  const toggleResizingEnabled = (newValue: boolean) => {
    if (newValue && process.env.NODE_ENV === 'development') {
      console.log('Resizing enabled');
    }

    setIsResizingEnabled(newValue);
  };

  const contextValue: EditModeContextValue = {
    isEditingEnabled,
    toggleEditingEnabled,
    isResizingEnabled,
    toggleResizingEnabled,
    layout,
    setLayout,
    draggingItem,
    setDraggingItem,
    selectedSectionId,
    setSelectedSectionId,
  };

  return (
    <EditModeContext.Provider value={contextValue}>
      {children}
    </EditModeContext.Provider>
  );
};
