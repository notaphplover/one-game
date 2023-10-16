import { GraphQlErrorFromErrorBuilder } from '@cornie-js/backend-graphql';
import { HttpStatusCodeFromErrorBuilder } from '@cornie-js/backend-http';
import { Module } from '@nestjs/common';

@Module({
  exports: [GraphQlErrorFromErrorBuilder],
  providers: [GraphQlErrorFromErrorBuilder, HttpStatusCodeFromErrorBuilder],
})
export class GraphqlModule {}
