import { useState } from 'react';
import { DisplayDialog } from '../models/DisplayDialog';

export const useDisplayDialog = (): DisplayDialog => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const setHandleOpenDialog = (): void => {
    setOpenDialog(true);
  };

  const setHandleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  return {
    openDialog,
    setHandleOpenDialog,
    setHandleCloseDialog,
  };
};
