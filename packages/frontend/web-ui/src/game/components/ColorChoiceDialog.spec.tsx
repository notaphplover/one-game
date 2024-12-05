import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { models as apiModels } from '@cornie-js/api-models';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormEvent } from 'react';

import { ColorChoiceDialog } from './ColorChoiceDialog';

describe(ColorChoiceDialog.name, () => {
  let openFixture: boolean;
  let onCloseMock: jest.Mock<() => void>;
  let onHandlePlayCardsChoiceColorMock: jest.Mock<
    (event: FormEvent, color: apiModels.CardColorV1) => void
  >;
  let classNameBlueFixture: string;
  let classNameGreenFixture: string;
  let classNameRedFixture: string;
  let classNameYellowFixture: string;

  beforeAll(() => {
    openFixture = true;
    onHandlePlayCardsChoiceColorMock = jest.fn();
    onCloseMock = jest.fn();
    classNameBlueFixture = 'blue';
    classNameGreenFixture = 'green';
    classNameRedFixture = 'red';
    classNameYellowFixture = 'yellow';
  });

  describe('when called,', () => {
    let isExpectedClassNameBlue: boolean;
    let isExpectedClassNameGreen: boolean;
    let isExpectedClassNameRed: boolean;
    let isExpectedClassNameYellow: boolean;

    beforeAll(() => {
      render(
        <ColorChoiceDialog
          open={openFixture}
          onClose={onCloseMock}
          onHandlePlayCardsChoiceColor={onHandlePlayCardsChoiceColorMock}
        ></ColorChoiceDialog>,
      );

      const divColorChoiceGreen: HTMLElement =
        screen.getByTestId('color-choice-green');

      isExpectedClassNameGreen = divColorChoiceGreen.classList.contains(
        classNameGreenFixture,
      );

      const divColorChoiceBlue: HTMLElement =
        screen.getByTestId('color-choice-blue');

      isExpectedClassNameBlue =
        divColorChoiceBlue.classList.contains(classNameBlueFixture);

      const divColorChoiceRed: HTMLElement =
        screen.getByTestId('color-choice-red');

      isExpectedClassNameRed =
        divColorChoiceRed.classList.contains(classNameRedFixture);

      const divColorChoiceYellow: HTMLElement = screen.getByTestId(
        'color-choice-yellow',
      );

      isExpectedClassNameYellow = divColorChoiceYellow.classList.contains(
        classNameYellowFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should contain a div with a green color choice', () => {
      expect(isExpectedClassNameGreen).toBe(true);
    });

    it('should contain a div with a blue color choice', () => {
      expect(isExpectedClassNameBlue).toBe(true);
    });

    it('should contain a div with a red color choice', () => {
      expect(isExpectedClassNameRed).toBe(true);
    });

    it('should contain a div with a yellow color choice', () => {
      expect(isExpectedClassNameYellow).toBe(true);
    });
  });

  describe('when called, and choice a color', () => {
    let divColorChoice: HTMLElement;

    describe('having a green color', () => {
      beforeAll(() => {
        render(
          <ColorChoiceDialog
            open={openFixture}
            onClose={onCloseMock}
            onHandlePlayCardsChoiceColor={onHandlePlayCardsChoiceColorMock}
          ></ColorChoiceDialog>,
        );

        divColorChoice = screen.getByTestId('color-choice-green');

        fireEvent.click(divColorChoice);

        void waitFor(() => {
          // eslint-disable-next-line jest/no-standalone-expect
          expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledTimes(1);
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call a onHandlePlayCardsChoiceColorMock() with params color choice green', () => {
        expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledTimes(1);
        expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledWith(
          expect.anything(),
          'green',
        );
      });
    });

    describe('having a blue color', () => {
      beforeAll(() => {
        render(
          <ColorChoiceDialog
            open={openFixture}
            onClose={onCloseMock}
            onHandlePlayCardsChoiceColor={onHandlePlayCardsChoiceColorMock}
          ></ColorChoiceDialog>,
        );

        divColorChoice = screen.getByTestId('color-choice-blue');

        fireEvent.click(divColorChoice);

        void waitFor(() => {
          // eslint-disable-next-line jest/no-standalone-expect
          expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledTimes(1);
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call a onHandlePlayCardsChoiceColorMock() with params color choice blue', () => {
        expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledTimes(1);
        expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledWith(
          expect.anything(),
          'blue',
        );
      });
    });

    describe('having a red color', () => {
      beforeAll(() => {
        render(
          <ColorChoiceDialog
            open={openFixture}
            onClose={onCloseMock}
            onHandlePlayCardsChoiceColor={onHandlePlayCardsChoiceColorMock}
          ></ColorChoiceDialog>,
        );

        divColorChoice = screen.getByTestId('color-choice-red');

        fireEvent.click(divColorChoice);

        void waitFor(() => {
          // eslint-disable-next-line jest/no-standalone-expect
          expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledTimes(1);
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call a onHandlePlayCardsChoiceColorMock() with params color choice red', () => {
        expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledTimes(1);
        expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledWith(
          expect.anything(),
          'red',
        );
      });
    });

    describe('having a yellow color', () => {
      beforeAll(() => {
        render(
          <ColorChoiceDialog
            open={openFixture}
            onClose={onCloseMock}
            onHandlePlayCardsChoiceColor={onHandlePlayCardsChoiceColorMock}
          ></ColorChoiceDialog>,
        );

        divColorChoice = screen.getByTestId('color-choice-yellow');

        fireEvent.click(divColorChoice);

        void waitFor(() => {
          // eslint-disable-next-line jest/no-standalone-expect
          expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledTimes(1);
        });
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call a onHandlePlayCardsChoiceColorMock() with params color choice yellow', () => {
        expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledTimes(1);
        expect(onHandlePlayCardsChoiceColorMock).toHaveBeenCalledWith(
          expect.anything(),
          'yellow',
        );
      });
    });
  });
});
