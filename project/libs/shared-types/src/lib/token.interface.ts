export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  jti?: string;
  exp?: number;
}
