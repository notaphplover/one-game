import { useEffect, useState } from 'react';

export interface SnackbarMessage {
  content: string;
  key: number;
}

export interface UseConsecutiveSnackBarResult {
  close: () => void;
  dequeue: () => void;
  enqueue: (messageContent: string) => void;
  message: SnackbarMessage | undefined;
  open: boolean;
}

function isNotEmpty<T>(array: readonly T[]): array is [T, ...T[]] {
  return array.length !== 0;
}

export default function useConsecutiveSnackbars(): UseConsecutiveSnackBarResult {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [message, setMessageInfo] = useState<SnackbarMessage | undefined>(
    undefined,
  );

  useEffect(() => {
    if (isNotEmpty(snackPack)) {
      if (message === undefined) {
        const [snack, ...pack] = snackPack;

        setMessageInfo(snack);
        setSnackPack(pack);
        setOpen(true);
      } else {
        if (open) {
          setOpen(false);
        }
      }
    }
  }, [snackPack, message, open]);

  const enqueue = (messageContent: string) => {
    setSnackPack((prev) => [
      ...prev,
      { content: messageContent, key: Date.now() },
    ]);
  };

  const close = () => {
    setOpen(false);
  };

  const dequeue = () => {
    setMessageInfo(undefined);
  };

  return {
    close,
    dequeue,
    enqueue,
    message,
    open,
  };
}
