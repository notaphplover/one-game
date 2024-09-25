import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/layout/CornieLayout');
jest.mock('../../common/pages/PageNotFound');
jest.mock('../components/Card', () => ({ Card: jest.fn() }), { virtual: true });
jest.mock('../hooks/useGame');
jest.mock('./NonStartedGame');

import { models as apiModels } from '@cornie-js/api-models';
import { render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import {
  CornieLayout,
  CornieLayoutParams,
} from '../../common/layout/CornieLayout';
import { PageNotFound } from '../../common/pages/PageNotFound';
import { useGame, UseGameResult } from '../hooks/useGame';
import { Game } from './Game';
import { NonStartedGame } from './NonStartedGame';

describe(Game.name, () => {
  describe('when called, and useGame() returns a non pending state with an undefined game', () => {
    let pageNotFoundElementFixture: React.JSX.Element;
    let useGameResultFixture: UseGameResult;

    let nonStartedGameElement: HTMLElement;

    beforeAll(() => {
      pageNotFoundElementFixture = (
        <div data-testid="non-started-game">This is just a fixture</div>
      );

      useGameResultFixture = {
        currentCard: undefined,
        game: undefined,
        isPending: false,
        useGameCardsResult: {
          cards: [],
          hasNext: false,
          hasPrevious: false,
          setNext: jest.fn(),
          setPrevious: jest.fn(),
        },
      };

      (useGame as jest.Mock<typeof useGame>).mockReturnValueOnce(
        useGameResultFixture,
      );

      (PageNotFound as jest.Mock<typeof PageNotFound>).mockReturnValueOnce(
        pageNotFoundElementFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Game />
        </MemoryRouter>,
      );

      nonStartedGameElement = renderResult.getByTestId('non-started-game');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call PageNotFound', () => {
      expect(PageNotFound).toHaveBeenCalledTimes(1);
      expect(PageNotFound).toHaveBeenCalledWith({}, {});
    });

    it('should return expected value', () => {
      const expected: Element | undefined = render(pageNotFoundElementFixture)
        .container.children[0];

      expect(nonStartedGameElement).toStrictEqual(expected);
    });
  });

  describe('when called, and useGame() returns a non pending state with a non started game', () => {
    let gameFixture: apiModels.NonStartedGameV1;
    let nonStartedGameElementFixture: React.JSX.Element;
    let useGameResultFixture: UseGameResult;

    let nonStartedGameElement: HTMLElement;

    beforeAll(() => {
      gameFixture = {
        id: 'game-id-fixture',
        isPublic: true,
        state: {
          slots: [],
          status: 'nonStarted',
        },
      };

      nonStartedGameElementFixture = (
        <div data-testid="non-started-game">This is just a fixture</div>
      );

      useGameResultFixture = {
        currentCard: undefined,
        game: gameFixture,
        isPending: false,
        useGameCardsResult: {
          cards: [],
          hasNext: false,
          hasPrevious: false,
          setNext: jest.fn(),
          setPrevious: jest.fn(),
        },
      };

      (useGame as jest.Mock<typeof useGame>).mockReturnValueOnce(
        useGameResultFixture,
      );

      (NonStartedGame as jest.Mock<typeof NonStartedGame>).mockReturnValueOnce(
        nonStartedGameElementFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Game />
        </MemoryRouter>,
      );

      nonStartedGameElement = renderResult.getByTestId('non-started-game');
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call NonStartedGame', () => {
      expect(NonStartedGame).toHaveBeenCalledTimes(1);
      expect(NonStartedGame).toHaveBeenCalledWith({}, {});
    });

    it('should return expected value', () => {
      const expected: Element | undefined = render(nonStartedGameElementFixture)
        .container.children[0];

      expect(nonStartedGameElement).toStrictEqual(expected);
    });
  });

  describe('when called, and useGame() returns a pending state with an undefined game', () => {
    let useGameResultFixture: UseGameResult;

    let cardElements: HTMLCollection;

    beforeAll(() => {
      useGameResultFixture = {
        currentCard: undefined,
        game: undefined,
        isPending: true,
        useGameCardsResult: {
          cards: [],
          hasNext: false,
          hasPrevious: false,
          setNext: jest.fn(),
          setPrevious: jest.fn(),
        },
      };

      (useGame as jest.Mock<typeof useGame>).mockReturnValueOnce(
        useGameResultFixture,
      );

      const renderResult: RenderResult = render(
        <MemoryRouter>
          <Game />
        </MemoryRouter>,
      );

      cardElements = renderResult.getByTestId('game-area').children;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call CornieLayout()', () => {
      const expectedParams: CornieLayoutParams = {
        children: expect.any(Object) as unknown as React.JSX.Element,
        withNavBar: true,
      };

      expect(CornieLayout).toHaveBeenCalledTimes(1);
      expect(CornieLayout).toHaveBeenCalledWith(expectedParams, {});
    });

    it('should render two cards in the game area', () => {
      expect(cardElements).toHaveLength(2);
    });
  });
});
