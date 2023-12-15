import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BatchedGetByIdHandler } from './BatchedGetByIdHandler';

class GetEntityByIdHandlerMock<
  TId,
  TInput,
  TOutput,
> extends BatchedGetByIdHandler<TId, TInput, TOutput> {
  readonly #buildOutputMock: jest.Mock<(entity: TInput) => TOutput>;
  readonly #getByIdsMock: jest.Mock<(ids: readonly TId[]) => Promise<TInput[]>>;
  readonly #getIdMock: jest.Mock<(entity: TInput) => TId>;

  constructor(
    buildOutputMock: jest.Mock<(entity: TInput) => TOutput>,
    getByIdsMock: jest.Mock<(ids: readonly TId[]) => Promise<TInput[]>>,
    getIdMock: jest.Mock<(entity: TInput) => TId>,
  ) {
    super();

    this.#buildOutputMock = buildOutputMock;
    this.#getByIdsMock = getByIdsMock;
    this.#getIdMock = getIdMock;
  }

  protected override _buildOutput(input: TInput): TOutput {
    return this.#buildOutputMock(input);
  }

  protected override async _getByIds(ids: readonly TId[]): Promise<TInput[]> {
    return this.#getByIdsMock(ids);
  }

  protected override _getId(entity: TInput): TId {
    return this.#getIdMock(entity);
  }
}

describe(BatchedGetByIdHandler.name, () => {
  let buildOutputMock: jest.Mock<(entity: unknown) => unknown>;
  let getByIdsMock: jest.Mock<(ids: readonly unknown[]) => Promise<unknown[]>>;
  let getIdMock: jest.Mock<(entity: unknown) => unknown>;

  beforeAll(() => {
    buildOutputMock = jest
      .fn()
      .mockImplementation((entity: unknown): unknown => entity);
    getByIdsMock = jest.fn();
    getIdMock = jest
      .fn()
      .mockImplementation((entity: unknown): unknown => entity);
  });

  describe('.handle', () => {
    describe('having an id array with two elements', () => {
      let firstId: unknown;
      let secondId: unknown;

      beforeAll(() => {
        firstId = 'first-id';
        secondId = 'second-id';
      });

      describe('when called, and getByIds() returns two elements in the right order', () => {
        let getEntityByIdHandlerMock: GetEntityByIdHandlerMock<
          unknown,
          unknown,
          unknown
        >;

        let result: unknown;

        beforeAll(async () => {
          getEntityByIdHandlerMock = new GetEntityByIdHandlerMock(
            buildOutputMock,
            getByIdsMock,
            getIdMock,
          );

          getByIdsMock.mockResolvedValueOnce([firstId, secondId]);

          result = await Promise.all([
            getEntityByIdHandlerMock.handle(firstId),
            getEntityByIdHandlerMock.handle(secondId),
          ]);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call getByIds()', () => {
          expect(getByIdsMock).toHaveBeenCalledTimes(1);
          expect(getByIdsMock).toHaveBeenCalledWith([firstId, secondId]);
        });

        it('should not call getId()', () => {
          expect(getIdMock).not.toHaveBeenCalled();
        });

        it('should return an array of entities', () => {
          expect(result).toStrictEqual([firstId, secondId]);
        });
      });

      describe('when called, and getByIds() returns first element and getId() matches ids', () => {
        let getEntityByIdHandlerMock: GetEntityByIdHandlerMock<
          unknown,
          unknown,
          unknown
        >;

        let result: unknown;

        beforeAll(async () => {
          getEntityByIdHandlerMock = new GetEntityByIdHandlerMock(
            buildOutputMock,
            getByIdsMock,
            getIdMock,
          );

          getByIdsMock.mockResolvedValueOnce([firstId]);

          result = await Promise.all([
            getEntityByIdHandlerMock.handle(firstId),
            getEntityByIdHandlerMock.handle(secondId),
          ]);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call getByIds()', () => {
          expect(getByIdsMock).toHaveBeenCalledTimes(1);
          expect(getByIdsMock).toHaveBeenCalledWith([firstId, secondId]);
        });

        it('should call getId()', () => {
          expect(getIdMock).toHaveBeenCalledTimes(1);
          expect(getIdMock).toHaveBeenCalledWith(firstId);
        });

        it('should return an array of entities', () => {
          expect(result).toStrictEqual([firstId, undefined]);
        });
      });

      describe('when called, and getByIds() returns second element and getId() matches ids', () => {
        let getEntityByIdHandlerMock: GetEntityByIdHandlerMock<
          unknown,
          unknown,
          unknown
        >;

        let result: unknown;

        beforeAll(async () => {
          getEntityByIdHandlerMock = new GetEntityByIdHandlerMock(
            buildOutputMock,
            getByIdsMock,
            getIdMock,
          );

          getByIdsMock.mockResolvedValueOnce([secondId]);

          result = await Promise.all([
            getEntityByIdHandlerMock.handle(firstId),
            getEntityByIdHandlerMock.handle(secondId),
          ]);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call getByIds()', () => {
          expect(getByIdsMock).toHaveBeenCalledTimes(1);
          expect(getByIdsMock).toHaveBeenCalledWith([firstId, secondId]);
        });

        it('should call getId()', () => {
          expect(getIdMock).toHaveBeenCalledTimes(1);
          expect(getIdMock).toHaveBeenCalledWith(secondId);
        });

        it('should return an array of entities', () => {
          expect(result).toStrictEqual([undefined, secondId]);
        });
      });
    });
  });
});
