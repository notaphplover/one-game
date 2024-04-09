import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { useDisplayDialog } from './useDisplayDialog';
import { RenderHookResult, act, renderHook } from '@testing-library/react';
import { DisplayDialog } from '../models/DisplayDialog';

describe(useDisplayDialog.name, () => {
  describe('when called, on an initialize values', () => {
    let renderResult: RenderHookResult<DisplayDialog, unknown>;
    let openDialog: boolean;

    beforeAll(() => {
      renderResult = renderHook(() => useDisplayDialog());

      openDialog = renderResult.result.current.openDialog;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a false value on openDialog variable', () => {
      expect(openDialog).toBe(false);
    });

    it('should return setHandleCloseDialog()', () => {
      expect(renderResult.result.current.setHandleCloseDialog).toBeInstanceOf(
        Function,
      );
    });

    it('should return setHandleOpenDialog()', () => {
      expect(renderResult.result.current.setHandleOpenDialog).toBeInstanceOf(
        Function,
      );
    });
  });

  describe('when called, on setHandleOpenDialog() and the dialog is showed', () => {
    let renderResult: RenderHookResult<DisplayDialog, unknown>;
    let openDialog: boolean;

    beforeAll(() => {
      renderResult = renderHook(() => useDisplayDialog());

      act(() => {
        renderResult.result.current.setHandleOpenDialog();
      });

      openDialog = renderResult.result.current.openDialog;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a true value on openDialog variable', () => {
      expect(openDialog).toBe(true);
    });
  });

  describe('when called, on setHandleCloseDialog() and the dialog is closed', () => {
    let renderResult: RenderHookResult<DisplayDialog, unknown>;
    let openDialogOpen: boolean;
    let openDialogClose: boolean;

    beforeAll(() => {
      renderResult = renderHook(() => useDisplayDialog());

      act(() => {
        renderResult.result.current.setHandleOpenDialog();
      });

      openDialogOpen = renderResult.result.current.openDialog;

      act(() => {
        renderResult.result.current.setHandleCloseDialog();
      });

      openDialogClose = renderResult.result.current.openDialog;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return a true value on openDialog variable', () => {
      expect(openDialogOpen).toBe(true);
    });

    it('should rereturn a false value on openDialog variable again', () => {
      expect(openDialogClose).toBe(false);
    });
  });
});
