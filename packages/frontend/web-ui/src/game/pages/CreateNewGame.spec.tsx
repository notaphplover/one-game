import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../hooks/useCreateNewGame');
jest.mock('../hooks/useDisplayDialog');
jest.mock('../helpers/setFormFieldValue');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: jest.fn(),
}));

import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useCreateNewGame } from '../hooks/useCreateNewGame';
import { useDisplayDialog } from '../hooks/useDisplayDialog';
import { setFormFieldValue } from '../helpers/setFormFieldValue';
import { CreateNewGame } from './CreateNewGame';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { setFormFieldsParams } from '../models/CreateNewGameResult';
import { RenderResult, fireEvent, render } from '@testing-library/react';

describe(CreateNewGame.name, () => {
  let formFieldsFixture: FormFieldsNewGame;

  let notifyFormFieldsFilledMock: jest.Mock<() => void>;
  let setFormFieldMock: jest.Mock<(params: setFormFieldsParams) => void>;

  let setHandleOpenDialogMock: jest.Mock<() => void>;
  let setHandleCloseDialogMock: jest.Mock<() => void>;

  let setFormFieldValueMock: jest.Mock<
    (fieldName: string, fieldValue: string) => string | number
  >;

  let navigateMock: ReturnType<typeof useNavigate> &
    jest.Mock<ReturnType<typeof useNavigate>>;

  beforeAll(() => {
    formFieldsFixture = {
      name: 'name-fixture',
      players: 2,
      options: {
        chainDraw2Draw2Cards: false,
        chainDraw2Draw4Cards: false,
        chainDraw4Draw4Cards: false,
        chainDraw4Draw2Cards: false,
        playCardIsMandatory: false,
        playMultipleSameCards: false,
        playWildDraw4IfNoOtherAlternative: true,
      },
    };

    notifyFormFieldsFilledMock = jest.fn();
    setFormFieldMock = jest.fn();

    setHandleOpenDialogMock = jest.fn();
    setHandleCloseDialogMock = jest.fn();

    setFormFieldValueMock = jest.fn();

    navigateMock = jest
      .fn<ReturnType<typeof useNavigate>>()
      .mockReturnValue(undefined) as ReturnType<typeof useNavigate> &
      jest.Mock<ReturnType<typeof useNavigate>>;
  });

  describe('when called, on an initial state', () => {
    let inputName: string;
    let inputPlayers: number;

    beforeAll(() => {
      (
        useCreateNewGame as jest.Mock<typeof useCreateNewGame>
      ).mockReturnValueOnce({
        formFields: formFieldsFixture,
        status: CreateNewGameStatus.initial,
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        formValidation: {},
        backendError: null,
        setFormField: setFormFieldMock,
      });

      (
        useDisplayDialog as jest.Mock<typeof useDisplayDialog>
      ).mockReturnValueOnce({
        openDialog: true,
        setHandleOpenDialog: setHandleOpenDialogMock,
        setHandleCloseDialog: setHandleCloseDialogMock,
      });

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <CreateNewGame />
        </MemoryRouter>,
      );

      const buttonOptions: Element = renderResult.container.querySelector(
        '.button-new-game-options',
      ) as Element;

      fireEvent.click(buttonOptions);

      const formNameTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-name-new-game')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputName = formNameTextFieldInput.value;

      const formPlayersTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-players-new-game')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputPlayers = parseInt(formPlayersTextFieldInput.value);
    });

    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should initialize name', () => {
      expect(inputName).toBe(formFieldsFixture.name);
    });

    it('should initialize players', () => {
      expect(inputPlayers).toBe(formFieldsFixture.players);
    });
  });
});
