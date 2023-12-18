import { ApolloServer } from '@apollo/server';
import { Context } from '@cornie-js/backend-gateway-application';
import { ConsoleLogger, LoggerService } from '@nestjs/common';

export function registerSignalHandlers(server: ApolloServer<Context>): void {
  const logger: LoggerService = new ConsoleLogger();

  registerExitSignalHandlers(server, logger, ['SIGINT', 'SIGTERM']);
}

async function closeServerGracefully(
  server: ApolloServer<Context>,
  logger: LoggerService,
): Promise<void> {
  logger.log('Closing signal received.');
  logger.log('Closing server...');

  await server.stop();

  logger.log('Server closed.');
}

function exitSignalHandler(
  server: ApolloServer<Context>,
  logger: LoggerService,
): () => void {
  return () => {
    void closeServerGracefully(server, logger);
  };
}

function registerExitSignalHandlers(
  server: ApolloServer<Context>,
  logger: LoggerService,
  signals: NodeJS.Signals[],
): void {
  for (const signal of signals) {
    process.on(signal, exitSignalHandler(server, logger));
  }
}
