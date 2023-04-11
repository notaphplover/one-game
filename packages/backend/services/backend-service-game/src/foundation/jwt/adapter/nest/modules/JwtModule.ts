import { Module } from '@nestjs/common';
import { JwtService } from '@one-game-js/backend-jwt';

import { UserJwtPayload } from '../../../../../user/application/models/UserJwtPayload';
import { EnvModule } from '../../../../env/adapter/nest/modules/EnvModule';
import { Environment } from '../../../../env/application/models/Environment';
import { EnvironmentService } from '../../../../env/application/services/EnvironmentService';

@Module({
  exports: [JwtService],
  imports: [EnvModule],
  providers: [
    {
      inject: [EnvironmentService],
      provide: JwtService,
      useFactory: (
        environmentService: EnvironmentService,
      ): JwtService<UserJwtPayload> => {
        const env: Environment = environmentService.getEnvironment();

        return new JwtService({
          algorithm: env.jwtAlgorithm,
          audience: env.jwtAudience,
          expirationMs: env.jwtExpirationMs,
          issuer: env.jwtIssuer,
          privateKey: env.jwtPrivateKey,
          publicKey: env.jwtPublicKey,
        });
      },
    },
  ],
})
export class JwtModule {}
