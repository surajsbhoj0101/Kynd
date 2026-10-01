import { SignJWT, type JWTPayload, jwtVerify } from "jose";

type CreateTokenOptions = {
  expiresIn: string | number;
  issuer?: string;
  audience?: string;
  secret: string;
};

type VerifyTokenOptions = {
  issuer?: string;
  audience?: string;
  secret: string;
};

export async function createToken(
  payload: JWTPayload,
  options: CreateTokenOptions,
) {
  const jwtSecret = new TextEncoder().encode(options.secret);
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setIssuedAt()
    .setExpirationTime(options.expiresIn)
    .setIssuer(options.issuer ?? "orchexis")
    .setAudience(options.audience ?? "orchexis")
    .sign(jwtSecret);
}

export async function verifyToken(token: string, options: VerifyTokenOptions) {
  const jwtSecret = new TextEncoder().encode(options.secret);

  const { payload } = await jwtVerify(token, jwtSecret, {
    algorithms: ["HS256"],
    issuer: options.issuer ?? "orchexis",
    audience: options.audience ?? "orchexis",
  });

  return payload;
}
