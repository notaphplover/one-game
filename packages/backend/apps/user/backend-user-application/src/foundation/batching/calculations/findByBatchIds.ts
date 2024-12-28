export function findByBatchIds<TEntity, TId>(
  getId: (entity: TEntity) => TId,
  findByIds: (ids: TId[]) => Promise<TEntity[]>,
): (ids: TId[]) => Promise<(TEntity | undefined)[]> {
  return async (ids: TId[]): Promise<(TEntity | undefined)[]> => {
    const idToIndexesMap: Map<TId, number[]> = new Map();

    ids.forEach((id: TId, index: number): void => {
      let idIndexes: number[] | undefined = idToIndexesMap.get(id);

      if (idIndexes === undefined) {
        idIndexes = [];

        idToIndexesMap.set(id, idIndexes);
      }

      idIndexes.push(index);
    });

    const entities: TEntity[] = await findByIds(ids);

    const mappedEntities: (TEntity | undefined)[] = new Array<TEntity>(
      ids.length,
    );

    for (const entity of entities) {
      const entityId: TId = getId(entity);

      const idIndexes: number[] | undefined = idToIndexesMap.get(entityId);

      if (idIndexes !== undefined) {
        for (const index of idIndexes) {
          mappedEntities[index] = entity;
        }
      }
    }

    return mappedEntities;
  };
}
