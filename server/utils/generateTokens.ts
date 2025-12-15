import env from "../config/env";
import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload {
  [key: string]: any;
}

const defaultOptions: SignOptions = {
  algorithm: "HS256",
};

export const generateAccessToken = (data: JwtPayload) => {
  // @ts-ignore
  return jwt.sign({ data }, env.ACCESS_TOKEN_SECRET, {
    ...defaultOptions,
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (data: JwtPayload) => {
  // @ts-ignore
  return jwt.sign({ data }, env.REFRESH_TOKEN_SECRET, {
    ...defaultOptions,
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
};

export const generateTokens = (data: JwtPayload) => {
  const accessToken = generateAccessToken(data);
  const refreshToken = generateRefreshToken(data);

  return { accessToken, refreshToken };
};
