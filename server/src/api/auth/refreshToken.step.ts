import { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import User, { IUser } from "../../../models/user.model";
import env from "../../../config/env";
import jwt from "jsonwebtoken";

const responseSchema = {
  200: z.object({
    success: z.boolean(),
  }),
  401: z.object({ error: z.string() }),
  404: z.object({ error: z.string() }),
  500: z.object({ error: z.string() }),
};

export const config: ApiRouteConfig = {
  type: "api",
  name: "auth.refresh-token",
  description: "Refresh a user's token",
  path: "/auth/refresh-token",
  method: "POST",
  emits: [],
  flows: ["auth"],
  responseSchema: responseSchema,
};

// @ts-ignore
export const handler: Handlers["auth.refresh-token"] = async (req, ctx) => {
  const incomingRefreshToken = (req.headers["authorization"] ??
    req.headers["Authorization"]) as string;
  const [, token] = incomingRefreshToken.split(" ");

  let decoded: any;
  try {
    decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return {
        status: 401,
        body: { error: "Invalid refresh token" },
      };
    }
    return {
      status: 401,
      body: { error: "Invalid refresh token" },
    };
  }

  await connectDB();
  const user = (await User.findById(decoded?.data?.id)) as IUser;
  if (!user) {
    return {
      status: 404,
      body: { error: "User not found" },
    };
  }

  return {
    status: 200,
    body: {
      success: true,
    },
  };
};
