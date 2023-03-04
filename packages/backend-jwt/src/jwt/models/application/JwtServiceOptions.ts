import { JwtAlgorithm } from './JwtAlgorithm';

export interface JwtServiceOptions {
  algorithm: JwtAlgorithm;
  audience: string | string[];
  issuer: string;
  expirationMs: number;
  privateKey: string;
  publicKey: string;
}
