import jwt from 'jsonwebtoken';

import { JwtAlgorithm } from '../../models/application/JwtAlgorithm';

export function convertToJsonwebtokenAlgorithm(
  algorithm: JwtAlgorithm,
): jwt.Algorithm {
  switch (algorithm) {
    case JwtAlgorithm.rsa256:
      return 'RS256';
    case JwtAlgorithm.rsa512:
      return 'RS512';
  }
}
