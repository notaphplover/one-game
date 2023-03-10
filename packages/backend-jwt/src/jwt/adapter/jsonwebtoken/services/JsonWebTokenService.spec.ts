import { beforeAll, describe, expect, it } from '@jest/globals';

import { JwtAlgorithm } from '../../../application/models/JwtAlgorithm';
import { JwtServiceOptions } from '../../../application/models/JwtServiceOptions';
import { JsonWebTokenService } from './JsonWebTokenService';

function assertJwtWithPayload(
  token: string,
  expectedPayloadProperties: Record<string, unknown>,
  options: JwtServiceOptions,
): void {
  const decodedPayload: Record<string, unknown> = extractJwtPayload(token);

  expect(decodedPayload).toStrictEqual(
    expect.objectContaining(
      buildExpectedPayload(expectedPayloadProperties, options),
    ),
  );
}

function buildExpectedPayload(
  expectedPayloadProperties: Record<string, unknown>,
  options: JwtServiceOptions,
): Record<string, unknown> {
  return {
    aud: options.audience,
    exp: expect.any(Number),
    iat: expect.any(Number),
    iss: options.issuer,
    ...expectedPayloadProperties,
  };
}

function extractJwtPayload(token: string): Record<string, unknown> {
  const tokenParts: string[] = token.split('.');

  if (tokenParts.length !== 3) {
    throw new Error('Invalid JWT value');
  }

  const decodedPayloadStringified: string = Buffer.from(
    tokenParts[1] as string,
    'base64',
  ).toString('utf8');

  const decodedPayload: Record<string, unknown> = JSON.parse(
    decodedPayloadStringified,
  ) as Record<string, unknown>;

  return decodedPayload;
}

describe(JsonWebTokenService.name, () => {
  let optionsFixture: JwtServiceOptions;
  let jsonWebTokenService: JsonWebTokenService<Record<string, unknown>>;

  beforeAll(() => {
    const privateKeyFixture: string = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAv4Ju3olsdYnANDz4ACs0ZzJtX+O95k/OB9o65QtEaDkIpUen
3Butte+Fp4QdFsuKGciO+xJazkTPclc8+eisT9WYMdsjWbbdLLfr3f2t5PRCtaQE
h0ajok2zbiiwcnkxcYAbcJh/w322OUsDa/c3pzBb165ws6NrkDbI2/ODB3sSiB+S
0znKOZ4tXqHJsp7ECivBQpU5Hnzmsmc2KCoutFbu+xzzUShk6/h+m22V/x5o/kb2
m65OfgioFIQ1DAw1scubLoCozUE6aKQWrrUl2dB3HuUsIeiu61WhBQ5LkQOy1hGd
Xmt06ttWsHrbBhao7eyArPJyrkRJvZW+vrl05wIDAQABAoIBAGmnT/s93bRKttsa
98dADr0QOP856b5yMLxsTSmnuam2LWrhyV3Jd2B0MExmupWk3R+0Yg1p5ub9V2VB
c8Z78vRoZnq65xnLpOHS5jGmjpVNnLARON5YvlYAgAk6MX42Fm0DvB+2QmZbqHib
Rdv+m5mFOGYZOtwgQGtjjhSql5M8ABKqteRHBC9RMNNugLOgrfjkkShO7svnvXS0
k/0JXfMKCtcZ4KBG9Qun4kb3i/Hdg6itnYBH3iBqLr64hv3yAWc4+gnF8X5d4MVz
brfkSIZK4uqQ5h7rvPlgv/b+QiQpOmAuIZ0+wI2Jw5T4b1sGXUrfvgtI2erb2pyU
biKS2OECgYEA/vHrrt0Jmat0baY9Z3C0g9Rj+dy5W1TSzWz3hd2z3CIqXEBHkPQ+
MCytabKa8zGyIA1f5t+udx9iwxWcsFOcPDTyE2VuvFUkZHukV6t32lXx/HZaC56W
V9wh/8xWXiHRcE/rgARBH/L80rIoLaC1IjW40UZxywlMdTtL18jG9EsCgYEAwE1P
q41OdloR2ChTBYugbt+F1NgxZ38EzbSragqkzj/CCriIzeKf6KgXWj/JLyelSSbu
cCDJY9CrSBZGYlIE3c8Fwo/U+wY8R2Mn4Hcjk28dCIL2PCC/uCNpQvf804C7YCq5
CPcJaMqYPdI51j1g5qLsyhYa4ux/Bw9k7iIYCFUCgYBeCgJzd9kIs/O4Vm+j7jDH
x9ow2jgM9lbjq2QKHuMvOfMCIDvFvjIKNxCoQldhiV048XYEhVGnYw5dA2XOrKie
lLEOcoXMNmO8JNdT9024XadrBoTkcFToh6yK3GanRjYpBXHKwMb87/ZOCaVEX1kx
CzvnBeMHj6CCRaMOL2MjzQKBgQCg2AlrVCXsmCmUwyWt3buzAQLPpISuLG+4HwXB
DGYMnQeQMAk9K/DUiMP/mJqN9nspVIbbApFwC3k4Mmlsk22+mQoYUnWyAOUqUKVp
+jyndKi0FdYfNMUnH3dLrGCsB2CybwmVlgsou0vbaZs2tt/2CRBFd3fFlkopfZbO
F3ZCgQKBgHYD+pRWog00sQQjMct8yscmnG44L+pHr0BEEGelcfa6bxxSJY8VPVd4
YNSA1flVnVbrC3nBYvjK1umKKiMyJKm+sxkf4zo7BxVquKDQylT6+rdMwyR2wBQp
NZfi61tA1NMJ5EdS/roWE5M7fRywOwk1FGJ+PP0X85aMAHdjlr2u
-----END RSA PRIVATE KEY-----
    `;

    const publicKeyFixture: string = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv4Ju3olsdYnANDz4ACs0
ZzJtX+O95k/OB9o65QtEaDkIpUen3Butte+Fp4QdFsuKGciO+xJazkTPclc8+eis
T9WYMdsjWbbdLLfr3f2t5PRCtaQEh0ajok2zbiiwcnkxcYAbcJh/w322OUsDa/c3
pzBb165ws6NrkDbI2/ODB3sSiB+S0znKOZ4tXqHJsp7ECivBQpU5Hnzmsmc2KCou
tFbu+xzzUShk6/h+m22V/x5o/kb2m65OfgioFIQ1DAw1scubLoCozUE6aKQWrrUl
2dB3HuUsIeiu61WhBQ5LkQOy1hGdXmt06ttWsHrbBhao7eyArPJyrkRJvZW+vrl0
5wIDAQAB
-----END PUBLIC KEY-----`;

    optionsFixture = {
      algorithm: JwtAlgorithm.rsa256,
      audience: 'sampleAudience',
      expirationMs: 10000,
      issuer: 'sample-issuer',
      privateKey: privateKeyFixture,
      publicKey: publicKeyFixture,
    };

    jsonWebTokenService = new JsonWebTokenService(optionsFixture);
  });

  describe('.create', () => {
    describe('when called', () => {
      let payloadFixture: Record<string, unknown>;

      let result: unknown;

      beforeAll(async () => {
        payloadFixture = {
          foo: 'bar',
        };

        result = await jsonWebTokenService.create(payloadFixture);
      });

      it('should return an strigified jwt', () => {
        expect(result).toStrictEqual(expect.any(String));
        assertJwtWithPayload(result as string, payloadFixture, optionsFixture);
      });
    });
  });

  describe('.parse', () => {
    describe('when called', () => {
      let payloadFixture: Record<string, unknown>;
      let jwtFixture: string;

      let result: unknown;

      beforeAll(async () => {
        payloadFixture = {
          foo: 'bar',
        };

        jwtFixture = await jsonWebTokenService.create(payloadFixture);

        result = await jsonWebTokenService.parse(jwtFixture);
      });

      it('should return a payload', () => {
        expect(result).toStrictEqual(
          expect.objectContaining(
            buildExpectedPayload(payloadFixture, optionsFixture),
          ),
        );
      });
    });
  });
});
