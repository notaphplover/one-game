import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Builder } from '@cornie-js/backend-common';
import { Card, CardColor } from '@cornie-js/backend-game-domain/cards';
import {
  DrawGameActionCreateQuery,
  PassTurnGameActionCreateQuery,
  PlayCardsGameActionCreateQuery,
} from '@cornie-js/backend-game-domain/gameActions';
import { GameActionCreateQueryFixtures } from '@cornie-js/backend-game-domain/gameActions/fixtures';
import { GameDirection } from '@cornie-js/backend-game-domain/games';
import {
  InsertQueryBuilder,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

import { CardColorDb } from '../../../../cards/adapter/typeorm/models/CardColorDb';
import { CardDb } from '../../../../cards/adapter/typeorm/models/CardDb';
import { GameDirectionDb } from '../../../../games/adapter/typeorm/models/GameDirectionDb';
import { GameActionDb } from '../models/GameActionDb';
import { GameActionDbVersion } from '../models/GameActionDbVersion';
import { DrawCardsGameActionDbPayloadV1 } from '../models/v1/DrawCardsGameActionDbPayloadV1';
import { GameActionDbPayloadV1Kind } from '../models/v1/GameActionDbPayloadV1Kind';
import { PassTurnGameActionDbPayloadV1 } from '../models/v1/PassTurnGameActionDbPayloadV1';
import { PlayCardsGameActionDbPayloadV1 } from '../models/v1/PlayCardsGameActionDbPayloadV1';
import { GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder } from './GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder';

describe(
  GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder.name,
  () => {
    let cardColorDbBuilderMock: jest.Mocked<Builder<CardColorDb, [CardColor]>>;
    let cardDbBuilderMock: jest.Mocked<Builder<CardDb, [Card]>>;
    let gameDirectionDbFromGameDirectionMock: jest.Mocked<
      Builder<GameDirectionDb, [GameDirection]>
    >;
    let repositoryMock: jest.Mocked<Repository<GameActionDb>>;
    let queryBuilderMock: jest.Mocked<
      InsertQueryBuilder<GameActionDb> & SelectQueryBuilder<GameActionDb>
    >;

    let gameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder: GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder;

    beforeAll(() => {
      cardColorDbBuilderMock = {
        build: jest.fn(),
      };
      cardDbBuilderMock = {
        build: jest.fn(),
      };
      gameDirectionDbFromGameDirectionMock = {
        build: jest.fn(),
      };

      queryBuilderMock = {
        from: jest.fn().mockReturnThis(),
        getQuery: jest.fn(),
        select: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        subQuery: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      } as Partial<
        jest.Mocked<
          InsertQueryBuilder<GameActionDb> & SelectQueryBuilder<GameActionDb>
        >
      > as jest.Mocked<
        InsertQueryBuilder<GameActionDb> & SelectQueryBuilder<GameActionDb>
      >;

      repositoryMock = {
        createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
      } as Partial<jest.Mocked<Repository<GameActionDb>>> as jest.Mocked<
        Repository<GameActionDb>
      >;

      gameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder =
        new GameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder(
          cardColorDbBuilderMock,
          cardDbBuilderMock,
          gameDirectionDbFromGameDirectionMock,
          repositoryMock,
        );
    });

    describe('.build', () => {
      describe('having a DrawGameActionCreateQuery', () => {
        let drawGameActionCreateQueryFixture: DrawGameActionCreateQuery;

        beforeAll(() => {
          drawGameActionCreateQueryFixture =
            GameActionCreateQueryFixtures.withKindDrawAndDrawOne;
        });

        describe('when called', () => {
          let cardDbFixture: CardDb;

          let result: unknown;

          let positionValue: () => string;

          beforeAll(() => {
            cardDbFixture = 0x0039;

            cardDbBuilderMock.build.mockReturnValueOnce(cardDbFixture);

            result =
              gameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder.build(
                drawGameActionCreateQueryFixture,
                queryBuilderMock,
              );
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call insertQueryBuilder.values()', () => {
            const expectedPayload: DrawCardsGameActionDbPayloadV1 = {
              draw: [cardDbFixture],
              kind: GameActionDbPayloadV1Kind.draw,
              version: GameActionDbVersion.v1,
            };

            const expectedGameActionDb: QueryDeepPartialEntity<GameActionDb> = {
              currentPlayingSlotIndex:
                drawGameActionCreateQueryFixture.currentPlayingSlotIndex,
              game: {
                id: drawGameActionCreateQueryFixture.gameId,
              },
              id: drawGameActionCreateQueryFixture.id,
              payload: JSON.stringify(expectedPayload),
              position: expect.any(Function) as unknown as () => string,
              turn: drawGameActionCreateQueryFixture.turn,
            };

            expect(queryBuilderMock.values).toHaveBeenCalledTimes(1);
            expect(queryBuilderMock.values).toHaveBeenCalledWith(
              expectedGameActionDb,
            );

            positionValue = (
              queryBuilderMock.values.mock.calls[0] as [
                QueryDeepPartialEntity<GameActionDb>,
              ]
            )[0].position as () => string;
          });

          it('should call insertQueryBuilder.setParameters()', () => {
            const expected: ObjectLiteral = {
              [`${GameActionDb.name}.game`]:
                drawGameActionCreateQueryFixture.gameId,
            };

            expect(queryBuilderMock.setParameters).toHaveBeenCalledTimes(1);
            expect(queryBuilderMock.setParameters).toHaveBeenCalledWith(
              expected,
            );
          });

          it('should return InsertQueryBuilder', () => {
            expect(result).toBe(queryBuilderMock);
          });

          describe('when position function is called', () => {
            let positionQueryFixture: string;

            let result: unknown;

            beforeAll(() => {
              positionQueryFixture = 'position-query-fixture';

              queryBuilderMock.getQuery.mockReturnValueOnce(
                positionQueryFixture,
              );

              result = positionValue();
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should call repository.createQueryBuilder()', () => {
              expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(
                1,
              );
              expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
                GameActionDb.name,
              );
            });

            it('should call queryBuilder.subQuery()', () => {
              expect(queryBuilderMock.subQuery).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.subQuery).toHaveBeenCalledWith();
            });

            it('should call queryBuilder.select()', () => {
              expect(queryBuilderMock.select).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.select).toHaveBeenCalledWith([
                `COALESCE(MAX(${GameActionDb.name}.position) + 1, 0) as position`,
              ]);
            });

            it('should call queryBuilder.from()', () => {
              expect(queryBuilderMock.from).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.from).toHaveBeenCalledWith(
                GameActionDb,
                GameActionDb.name,
              );
            });

            it('should call queryBuilder.where()', () => {
              expect(queryBuilderMock.where).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.where).toHaveBeenCalledWith(
                expect.any(String),
              );
            });

            it('should return string', () => {
              expect(result).toBe(positionQueryFixture);
            });
          });
        });
      });

      describe('having a PassTurnGameActionCreateQuery', () => {
        let passTurnGameActionCreateQueryFixture: PassTurnGameActionCreateQuery;

        beforeAll(() => {
          passTurnGameActionCreateQueryFixture =
            GameActionCreateQueryFixtures.withKindPassTurn;
        });

        describe('when called', () => {
          let result: unknown;

          let positionValue: () => string;

          beforeAll(() => {
            result =
              gameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder.build(
                passTurnGameActionCreateQueryFixture,
                queryBuilderMock,
              );
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call insertQueryBuilder.values()', () => {
            const expectedPayload: PassTurnGameActionDbPayloadV1 = {
              kind: GameActionDbPayloadV1Kind.passTurn,
              nextPlayingSlotIndex:
                passTurnGameActionCreateQueryFixture.nextPlayingSlotIndex,
              version: GameActionDbVersion.v1,
            };

            const expectedGameActionDb: QueryDeepPartialEntity<GameActionDb> = {
              currentPlayingSlotIndex:
                passTurnGameActionCreateQueryFixture.currentPlayingSlotIndex,
              game: {
                id: passTurnGameActionCreateQueryFixture.gameId,
              },
              id: passTurnGameActionCreateQueryFixture.id,
              payload: JSON.stringify(expectedPayload),
              position: expect.any(Function) as unknown as () => string,
              turn: passTurnGameActionCreateQueryFixture.turn,
            };

            expect(queryBuilderMock.values).toHaveBeenCalledTimes(1);
            expect(queryBuilderMock.values).toHaveBeenCalledWith(
              expectedGameActionDb,
            );

            positionValue = (
              queryBuilderMock.values.mock.calls[0] as [
                QueryDeepPartialEntity<GameActionDb>,
              ]
            )[0].position as () => string;
          });

          it('should call insertQueryBuilder.setParameters()', () => {
            const expected: ObjectLiteral = {
              [`${GameActionDb.name}.game`]:
                passTurnGameActionCreateQueryFixture.gameId,
            };

            expect(queryBuilderMock.setParameters).toHaveBeenCalledTimes(1);
            expect(queryBuilderMock.setParameters).toHaveBeenCalledWith(
              expected,
            );
          });

          it('should return InsertQueryBuilder', () => {
            expect(result).toBe(queryBuilderMock);
          });

          describe('when position function is called', () => {
            let positionQueryFixture: string;

            let result: unknown;

            beforeAll(() => {
              positionQueryFixture = 'position-query-fixture';

              queryBuilderMock.getQuery.mockReturnValueOnce(
                positionQueryFixture,
              );

              result = positionValue();
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should call repository.createQueryBuilder()', () => {
              expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(
                1,
              );
              expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
                GameActionDb.name,
              );
            });

            it('should call queryBuilder.subQuery()', () => {
              expect(queryBuilderMock.subQuery).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.subQuery).toHaveBeenCalledWith();
            });

            it('should call queryBuilder.select()', () => {
              expect(queryBuilderMock.select).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.select).toHaveBeenCalledWith([
                `COALESCE(MAX(${GameActionDb.name}.position) + 1, 0) as position`,
              ]);
            });

            it('should call queryBuilder.from()', () => {
              expect(queryBuilderMock.from).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.from).toHaveBeenCalledWith(
                GameActionDb,
                GameActionDb.name,
              );
            });

            it('should call queryBuilder.where()', () => {
              expect(queryBuilderMock.where).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.where).toHaveBeenCalledWith(
                expect.any(String),
              );
            });

            it('should return string', () => {
              expect(result).toBe(positionQueryFixture);
            });
          });
        });
      });

      describe('having a PlayCardsActionCreateQuery', () => {
        let playCardsGameActionCreateQueryFixture: PlayCardsGameActionCreateQuery;

        beforeAll(() => {
          playCardsGameActionCreateQueryFixture =
            GameActionCreateQueryFixtures.withKindPlayCardsAndCardsOne;
        });

        describe('when called', () => {
          let cardColorDbFixture: CardColorDb;
          let cardDbFixture: CardDb;
          let gameDirectionDbFixture: GameDirectionDb;

          let result: unknown;

          let positionValue: () => string;

          beforeAll(() => {
            cardColorDbFixture = 0x0030;
            cardDbFixture = 0x0039;
            gameDirectionDbFixture = GameDirectionDb.antiClockwise;

            cardColorDbBuilderMock.build.mockReturnValueOnce(
              cardColorDbFixture,
            );

            cardDbBuilderMock.build
              .mockReturnValueOnce(cardDbFixture)
              .mockReturnValueOnce(cardDbFixture);

            gameDirectionDbFromGameDirectionMock.build.mockReturnValueOnce(
              gameDirectionDbFixture,
            );

            result =
              gameActionCreateQueryTypeOrmFromGameActionCreateQueryBuilder.build(
                playCardsGameActionCreateQueryFixture,
                queryBuilderMock,
              );
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call insertQueryBuilder.values()', () => {
            const expectedPayload: PlayCardsGameActionDbPayloadV1 = {
              cards: [cardDbFixture],
              kind: GameActionDbPayloadV1Kind.playCards,
              stateUpdate: {
                currentCard: cardDbFixture,
                currentColor: cardColorDbFixture,
                currentDirection: gameDirectionDbFixture,
                drawCount: playCardsGameActionCreateQueryFixture.stateUpdate
                  .drawCount as number,
              },
              version: GameActionDbVersion.v1,
            };

            const expectedGameActionDb: QueryDeepPartialEntity<GameActionDb> = {
              currentPlayingSlotIndex:
                playCardsGameActionCreateQueryFixture.currentPlayingSlotIndex,
              game: {
                id: playCardsGameActionCreateQueryFixture.gameId,
              },
              id: playCardsGameActionCreateQueryFixture.id,
              payload: JSON.stringify(expectedPayload),
              position: expect.any(Function) as unknown as () => string,
              turn: playCardsGameActionCreateQueryFixture.turn,
            };

            expect(queryBuilderMock.values).toHaveBeenCalledTimes(1);
            expect(queryBuilderMock.values).toHaveBeenCalledWith(
              expectedGameActionDb,
            );

            positionValue = (
              queryBuilderMock.values.mock.calls[0] as [
                QueryDeepPartialEntity<GameActionDb>,
              ]
            )[0].position as () => string;
          });

          it('should call insertQueryBuilder.setParameters()', () => {
            const expected: ObjectLiteral = {
              [`${GameActionDb.name}.game`]:
                playCardsGameActionCreateQueryFixture.gameId,
            };

            expect(queryBuilderMock.setParameters).toHaveBeenCalledTimes(1);
            expect(queryBuilderMock.setParameters).toHaveBeenCalledWith(
              expected,
            );
          });

          it('should return InsertQueryBuilder', () => {
            expect(result).toBe(queryBuilderMock);
          });

          describe('when position function is called', () => {
            let positionQueryFixture: string;

            let result: unknown;

            beforeAll(() => {
              positionQueryFixture = 'position-query-fixture';

              queryBuilderMock.getQuery.mockReturnValueOnce(
                positionQueryFixture,
              );

              result = positionValue();
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should call repository.createQueryBuilder()', () => {
              expect(repositoryMock.createQueryBuilder).toHaveBeenCalledTimes(
                1,
              );
              expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
                GameActionDb.name,
              );
            });

            it('should call queryBuilder.subQuery()', () => {
              expect(queryBuilderMock.subQuery).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.subQuery).toHaveBeenCalledWith();
            });

            it('should call queryBuilder.select()', () => {
              expect(queryBuilderMock.select).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.select).toHaveBeenCalledWith([
                `COALESCE(MAX(${GameActionDb.name}.position) + 1, 0) as position`,
              ]);
            });

            it('should call queryBuilder.from()', () => {
              expect(queryBuilderMock.from).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.from).toHaveBeenCalledWith(
                GameActionDb,
                GameActionDb.name,
              );
            });

            it('should call queryBuilder.where()', () => {
              expect(queryBuilderMock.where).toHaveBeenCalledTimes(1);
              expect(queryBuilderMock.where).toHaveBeenCalledWith(
                expect.any(String),
              );
            });

            it('should return string', () => {
              expect(result).toBe(positionQueryFixture);
            });
          });
        });
      });
    });
  },
);
