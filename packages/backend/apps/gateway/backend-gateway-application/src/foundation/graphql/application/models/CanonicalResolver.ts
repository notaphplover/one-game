import { models as graphqlModels } from '@cornie-js/api-graphql-models';

export type CanonicalResolver<T extends object> = {
  [K in keyof T]: T[K] extends graphqlModels.Resolver<
    infer TResult,
    infer TParent,
    infer TContext,
    infer TArgs
  >
    ? graphqlModels.ResolverFn<TResult, TParent, TContext, TArgs>
    : T[K];
} & T;
