import { HttpClient, Response } from '@cornie-js/api-http-client';
import { models as apiModels } from '@cornie-js/api-models';
import { EnvironmentService } from '@cornie-js/backend-app-game-env';
import { AppError, AppErrorKind } from '@cornie-js/backend-common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserManagementInputPort {
  readonly #backendServicesSecret: string;

  readonly #httpClient: HttpClient;

  constructor(
    @Inject(EnvironmentService)
    environmentService: EnvironmentService,
    @Inject(HttpClient)
    httpClient: HttpClient,
  ) {
    this.#backendServicesSecret =
      environmentService.getEnvironment().apiBackendServiceSecret;
    this.#httpClient = httpClient;
  }

  public async findOne(id: string): Promise<apiModels.UserV1 | undefined> {
    const response:
      | Response<Record<string, string>, apiModels.UserV1, HttpStatus.OK>
      | Response<
          Record<string, string>,
          apiModels.ErrorV1,
          HttpStatus.UNAUTHORIZED
        >
      | Response<
          Record<string, string>,
          apiModels.ErrorV1,
          HttpStatus.NOT_FOUND
        > = await this.#httpClient.endpoints.getUser(
      {
        Authorization: this.#buildBearerToken(),
      },
      {
        userId: id,
      },
    );

    switch (response.statusCode) {
      case HttpStatus.OK:
        return response.body;
      case HttpStatus.UNAUTHORIZED:
        throw new AppError(
          AppErrorKind.unknown,
          'Unexpected unauthorized error',
        );
      case HttpStatus.NOT_FOUND:
        return undefined;
      default:
        throw new AppError(AppErrorKind.unknown, 'Unexpected error');
    }
  }

  #buildBearerToken(): string {
    return `Bearer ${this.#backendServicesSecret}`;
  }
}
