import { INestApplication, LoggerService } from '@nestjs/common';

export function registerSignalHandlers(
  nestApplication: INestApplication,
  logger: LoggerService,
): void {
  registerExitSignalHandlers(nestApplication, logger, ['SIGINT', 'SIGTERM']);
}

async function closeServerGracefully(
  nestApplication: INestApplication,
  logger: LoggerService,
): Promise<void> {
  logger.log('Closing signal received.');
  logger.log('Closing server...');

  await nestApplication.close();

  logger.log('Server closed.');
}

function exitSignalHandler(
  nestApplication: INestApplication,
  logger: LoggerService,
): () => void {
  return () => {
    void closeServerGracefully(nestApplication, logger);
  };
}

function registerExitSignalHandlers(
  nestApplication: INestApplication,
  logger: LoggerService,
  signals: NodeJS.Signals[],
): void {
  for (const signal of signals) {
    process.once(signal, exitSignalHandler(nestApplication, logger));
  }
}
