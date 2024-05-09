jest.mock('../hooks/useCreateNewGame');
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: jest.fn(),
}));

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';

import { Either } from '../../common/models/Either';
import {
  NUMBER_PLAYERS_MAXIMUM,
  NUMBER_PLAYERS_MINIMUM,
} from '../helpers/numberOfPlayersValues';
import { useCreateNewGame } from '../hooks/useCreateNewGame';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { FormFieldsNewGame } from '../models/FormFieldsNewGame';
import { FormNewGameValidationErrorResult } from '../models/FormNewGameValidationErrorResult';
import { GameOptions } from '../models/GameOptions';
import { CreateNewGame } from './CreateNewGame';

describe(CreateNewGame.name, () => {
  let formFieldsFixture: FormFieldsNewGame;

  let notifyFormFieldsFilledMock: jest.Mock<() => void>;
  let setFormFieldNameMock: jest.Mock<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >;
  let setFormFieldPlayersMock: jest.Mock<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >;
  let setFormFieldOptionsMock: jest.Mock<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >;

  let formValidationMock: Either<FormNewGameValidationErrorResult, undefined>;

  let navigateMock: ReturnType<typeof useNavigate> &
    jest.Mock<ReturnType<typeof useNavigate>>;

  beforeAll(() => {
    formFieldsFixture = {
      name: 'name-fixture',
      options: {
        chainDraw2Draw2Cards: false,
        chainDraw2Draw4Cards: false,
        chainDraw4Draw2Cards: false,
        chainDraw4Draw4Cards: false,
        playCardIsMandatory: false,
        playMultipleSameCards: false,
        playWildDraw4IfNoOtherAlternative: true,
      },
      players: NUMBER_PLAYERS_MINIMUM,
    };

    notifyFormFieldsFilledMock = jest.fn();

    setFormFieldNameMock = jest.fn();
    setFormFieldPlayersMock = jest.fn();
    setFormFieldOptionsMock = jest.fn();

    formValidationMock = {
      isRight: true,
      value: undefined,
    };

    navigateMock = jest
      .fn<ReturnType<typeof useNavigate>>()
      .mockReturnValue(undefined) as ReturnType<typeof useNavigate> &
      jest.Mock<ReturnType<typeof useNavigate>>;
  });

  describe('when called, on an initial state', () => {
    let renderResult: RenderResult;
    let inputName: string | undefined;
    let inputPlayers: number;
    let inputOptions: GameOptions;

    beforeAll(async () => {
      inputOptions = {
        chainDraw2Draw2Cards: true,
        chainDraw2Draw4Cards: true,
        chainDraw4Draw2Cards: true,
        chainDraw4Draw4Cards: true,
        playCardIsMandatory: true,
        playMultipleSameCards: true,
        playWildDraw4IfNoOtherAlternative: false,
      };

      (
        useCreateNewGame as jest.Mock<typeof useCreateNewGame>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formValidation: formValidationMock,
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormFieldName: setFormFieldNameMock,
        setFormFieldOptions: setFormFieldOptionsMock,
        setFormFieldPlayers: setFormFieldPlayersMock,
        status: CreateNewGameStatus.initial,
      });

      renderResult = render(
        <MemoryRouter>
          <CreateNewGame />
        </MemoryRouter>,
      );

      const formNameTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-name-new-game')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputName = formNameTextFieldInput.value;

      const formPlayersTextFieldInput: HTMLInputElement | null =
        (renderResult.container.querySelector('.form-players-new-game')
          ?.childNodes[1]?.firstChild as HTMLInputElement) ?? null;

      inputPlayers = parseInt(formPlayersTextFieldInput.value);

      const formOptionsButton: Element | null =
        renderResult.container.querySelector(
          '.button-new-game-options',
        ) as Element;

      (
        useCreateNewGame as jest.Mock<typeof useCreateNewGame>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formValidation: formValidationMock,
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormFieldName: setFormFieldNameMock,
        setFormFieldOptions: setFormFieldOptionsMock,
        setFormFieldPlayers: setFormFieldPlayersMock,
        status: CreateNewGameStatus.initial,
      });

      fireEvent.click(formOptionsButton);

      await waitFor(() => {
        const inputOptionsWithValue: HTMLInputElement[] =
          screen.getAllByRole('checkbox');

        for (const option of inputOptionsWithValue) {
          inputOptions = {
            ...inputOptions,
            [option.name]: option.checked,
          };
        }
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should initialize name', () => {
      expect(inputName).toStrictEqual(formFieldsFixture.name);
    });

    it('should initialize players', () => {
      expect(inputPlayers).toStrictEqual(formFieldsFixture.players);
    });

    it('should initialize options', () => {
      expect(inputOptions).toStrictEqual(formFieldsFixture.options);
    });
  });

  describe('when called, and players value is invalid and error is displayed', () => {
    let renderResult: RenderResult;
    let pErrorPlayers: string | null;
    const playersErrorFixture = `Invalid number of players. It must be from ${NUMBER_PLAYERS_MINIMUM} to ${NUMBER_PLAYERS_MAXIMUM} players.`;

    beforeAll(async () => {
      formFieldsFixture = {
        name: undefined,
        options: {
          chainDraw2Draw2Cards: false,
          chainDraw2Draw4Cards: false,
          chainDraw4Draw2Cards: false,
          chainDraw4Draw4Cards: false,
          playCardIsMandatory: false,
          playMultipleSameCards: false,
          playWildDraw4IfNoOtherAlternative: true,
        },
        players: 0,
      };

      (
        useCreateNewGame as jest.Mock<typeof useCreateNewGame>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formValidation: {
          isRight: false,
          value: {
            numberOfPlayers: playersErrorFixture,
          },
        },
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormFieldName: setFormFieldNameMock,
        setFormFieldOptions: setFormFieldOptionsMock,
        setFormFieldPlayers: setFormFieldPlayersMock,
        status: CreateNewGameStatus.validationKO,
      });

      renderResult = render(
        <MemoryRouter>
          <CreateNewGame />
        </MemoryRouter>,
      );

      const formPlayersTextParagraph: Text | null =
        (renderResult.container.querySelector('.form-players-new-game')
          ?.childNodes[2]?.firstChild as Text) ?? null;

      pErrorPlayers = formPlayersTextParagraph.textContent;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should players has an error', () => {
      expect(pErrorPlayers).toBe(playersErrorFixture);
    });
  });

  describe('when called, and exist a backend error and error is displayed', () => {
    let renderResult: RenderResult;
    let pErrorBackend: string | null;
    const backendErrorFixture: string = 'backend-error';

    beforeAll(async () => {
      (
        useCreateNewGame as jest.Mock<typeof useCreateNewGame>
      ).mockReturnValueOnce({
        backendError: backendErrorFixture,
        formFields: formFieldsFixture,
        formValidation: formValidationMock,
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormFieldName: setFormFieldNameMock,
        setFormFieldOptions: setFormFieldOptionsMock,
        setFormFieldPlayers: setFormFieldPlayersMock,
        status: CreateNewGameStatus.backendKO,
      });

      renderResult = render(
        <MemoryRouter>
          <CreateNewGame />
        </MemoryRouter>,
      );

      const formErrorMessageAlertMessage: Text | null =
        (renderResult.container.querySelector('.MuiAlert-message')
          ?.childNodes[1] as Text) ?? null;

      pErrorBackend = formErrorMessageAlertMessage.textContent;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should display a textbox with the message error', () => {
      expect(pErrorBackend).toBe(backendErrorFixture);
    });
  });

  describe('when called, and game is created and can navigate to the next page', () => {
    let renderResult: RenderResult;

    beforeAll(async () => {
      (useNavigate as jest.Mock<typeof useNavigate>).mockReturnValueOnce(
        navigateMock,
      );

      (
        useCreateNewGame as jest.Mock<typeof useCreateNewGame>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formValidation: formValidationMock,
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormFieldName: setFormFieldNameMock,
        setFormFieldOptions: setFormFieldOptionsMock,
        setFormFieldPlayers: setFormFieldPlayersMock,
        status: CreateNewGameStatus.backendOK,
      });

      renderResult = render(
        <MemoryRouter>
          <CreateNewGame />
        </MemoryRouter>,
      );

      const formCornieHomeButton: Element | null =
        renderResult.container.querySelector(
          '.new-game-cornie-button',
        ) as Element;

      (
        useCreateNewGame as jest.Mock<typeof useCreateNewGame>
      ).mockReturnValueOnce({
        backendError: null,
        formFields: formFieldsFixture,
        formValidation: formValidationMock,
        notifyFormFieldsFilled: notifyFormFieldsFilledMock,
        setFormFieldName: setFormFieldNameMock,
        setFormFieldOptions: setFormFieldOptionsMock,
        setFormFieldPlayers: setFormFieldPlayersMock,
        status: CreateNewGameStatus.backendOK,
      });

      fireEvent.click(formCornieHomeButton);

      await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should navigate to Cornie Home page', () => {
      expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
    });
  });
});
