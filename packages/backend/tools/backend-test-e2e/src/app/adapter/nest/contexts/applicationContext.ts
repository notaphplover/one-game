import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../modules/AppModule';

async function buildContext(): Promise<INestApplicationContext> {
  const appContext: INestApplicationContext =
    await NestFactory.createApplicationContext(AppModule);

  return appContext;
}

export const applicationContext: Promise<INestApplicationContext> =
  buildContext();
