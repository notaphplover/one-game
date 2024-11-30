import { models as apiModels } from '@cornie-js/api-models';

import { cloneGame } from './cloneGame';

const GAME_TURN_MS: number = 30000;

function buildFinishedGame(
  game: apiModels.ActiveGameV1,
): apiModels.FinishedGameV1 {
  const gameName: string | undefined = game.name;

  const finishedGame: apiModels.FinishedGameV1 = {
    id: game.id,
    isPublic: game.isPublic,
    state: {
      slots: game.state.slots.map(
        (
          updatedGameSlot: apiModels.ActiveGameSlotV1,
        ): apiModels.FinishedGameSlotV1 => ({
          cardsAmount: updatedGameSlot.cardsAmount,
          userId: updatedGameSlot.userId,
        }),
      ),
      status: 'finished',
    },
  };

  if (gameName !== undefined) {
    finishedGame.name = gameName;
  }

  return finishedGame;
}

export function handleGameMessageEvents(
  game: apiModels.ActiveGameV1,
  messageEventsQueue: [string, apiModels.GameEventV2][],
  onCardsChange: (gameSlotIndex: number) => void,
  onTurnChange: (gameSlotIndex: number) => void,
): apiModels.ActiveGameV1 | apiModels.FinishedGameV1 {
  const updatedGame: apiModels.ActiveGameV1 = cloneGame(game);

  for (const [id, messageEvent] of messageEventsQueue) {
    switch (messageEvent.kind) {
      case 'cardsDrawn':
        onCardsChange(messageEvent.currentPlayingSlotIndex);

        updatedGame.state.currentTurnCardsDrawn = true;
        updatedGame.state.drawCount = 0;
        (
          updatedGame.state.slots[
            messageEvent.currentPlayingSlotIndex
          ] as apiModels.ActiveGameSlotV1
        ).cardsAmount += messageEvent.drawAmount;

        break;
      case 'cardsPlayed':
        onCardsChange(messageEvent.currentPlayingSlotIndex);

        updatedGame.state.currentTurnCardsPlayed = true;
        (
          updatedGame.state.slots[
            messageEvent.currentPlayingSlotIndex
          ] as apiModels.ActiveGameSlotV1
        ).cardsAmount -= messageEvent.cards.length;

        if (messageEvent.currentCard === null) {
          return buildFinishedGame(updatedGame);
        }

        updatedGame.state.currentCard = messageEvent.currentCard;
        updatedGame.state.currentColor = messageEvent.currentColor;
        updatedGame.state.currentDirection = messageEvent.currentDirection;
        updatedGame.state.drawCount = messageEvent.drawCount;

        break;
      case 'turnPassed':
        if (messageEvent.nextPlayingSlotIndex === null) {
          return buildFinishedGame(updatedGame);
        } else {
          updatedGame.state.currentPlayingSlotIndex =
            messageEvent.nextPlayingSlotIndex;
          updatedGame.state.currentTurnCardsDrawn = false;
          updatedGame.state.currentTurnCardsPlayed = false;

          const date: Date = new Date();
          date.setMilliseconds(date.getMilliseconds() + GAME_TURN_MS);

          updatedGame.state.turnExpiresAt = date.toISOString();

          onTurnChange(updatedGame.state.currentPlayingSlotIndex);
        }

        break;
    }

    updatedGame.state.lastEventId = id;
  }

  return updatedGame;
}
