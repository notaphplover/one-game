import { ApolloServer } from '@apollo/server';
import { Request } from '@cornie-js/backend-http';
import { ConsoleLogger, LoggerService } from '@nestjs/common';

export function registerSignalHandlers(server: ApolloServer<Request>): void {
  const logger: LoggerService = new ConsoleLogger();

  registerExitSignalHandlers(server, logger, ['SIGINT', 'SIGTERM']);
}

async function closeServerGracefully(
  server: ApolloServer<Request>,
  logger: LoggerService,
): Promise<void> {
  logger.log('Closing signal received.');
  logger.log('Closing server...');

  await server.stop();

  logger.log('Server closed.');
}

function exitSignalHandler(
  server: ApolloServer<Request>,
  logger: LoggerService,
): () => void {
  return () => {
    void closeServerGracefully(server, logger);
  };
}

function registerExitSignalHandlers(
  server: ApolloServer<Request>,
  logger: LoggerService,
  signals: NodeJS.Signals[],
): void {
  for (const signal of signals) {
    process.on(signal, exitSignalHandler(server, logger));
  }
}
