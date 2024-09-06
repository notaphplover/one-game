import { beforeAll, describe, expect, it } from '@jest/globals';

import { render, RenderResult } from '@testing-library/react';
import { ReactNode } from 'react';

import { BaseGameListItem } from './BaseGameListItem';

describe(BaseGameListItem.name, () => {
  describe('having a game with no name', () => {
    describe('when called', () => {
      let expectedButtonTextValue: string;

      let buttonTextValue: string | null | undefined;
      let gameListTextValue: string | null | undefined;

      beforeAll(() => {
        expectedButtonTextValue = 'Mock content';

        const button: ReactNode = (
          <div className="button-mock">{expectedButtonTextValue}</div>
        );

        const renderResult: RenderResult = render(
          <BaseGameListItem button={button} />,
        );

        const buttonTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.button-mock')?.childNodes[0];

        buttonTextValue = buttonTextNode?.nodeValue;

        const gamesListTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.game-list-item-text')
            ?.childNodes[0];

        gameListTextValue = gamesListTextNode?.nodeValue;
      });

      it('should render a button', () => {
        expect(buttonTextValue).toStrictEqual(expectedButtonTextValue);
      });

      it('should render game text', () => {
        expect(gameListTextValue).toBe('--');
      });
    });
  });

  describe('having a game name', () => {
    let gameTextFixture: string;

    beforeAll(() => {
      gameTextFixture = 'nonStarted';
    });

    describe('when called', () => {
      let expectedButtonTextValue: string;

      let buttonTextValue: string | null | undefined;
      let gameListItemTextValue: string | null | undefined;

      beforeAll(() => {
        expectedButtonTextValue = 'Mock content';

        const button: ReactNode = (
          <div className="button-mock">{expectedButtonTextValue}</div>
        );

        const renderResult: RenderResult = render(
          <BaseGameListItem button={button} gameText={gameTextFixture} />,
        );

        const buttonTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.button-mock')?.childNodes[0];

        buttonTextValue = buttonTextNode?.nodeValue;

        const gameListItemTextNode: ChildNode | undefined =
          renderResult.container.querySelector('.game-list-item-text')
            ?.childNodes[0];

        gameListItemTextValue = gameListItemTextNode?.nodeValue;
      });

      it('should render a button', () => {
        expect(buttonTextValue).toStrictEqual(expectedButtonTextValue);
      });

      it('should render game text', () => {
        expect(gameListItemTextValue).toBe(gameTextFixture);
      });
    });
  });
});
