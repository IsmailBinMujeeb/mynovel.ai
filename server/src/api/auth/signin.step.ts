import { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { connectDB } from "../../../config/db";
import User, { IUser } from "../../../models/user.model";
import { generateTokens } from "../../../utils/generateTokens";
import bcrypt from "bcrypt";

const requestBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

const responseSchema = {
  200: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  401: z.object({ error: z.string() }),
  404: z.object({ error: z.string() }),
  500: z.object({ error: z.string() }),
};

export const config: ApiRouteConfig = {
  type: "api",
  name: "auth.signin",
  description: "Sign up a new user",
  path: "/auth/signin",
  method: "POST",
  emits: [],
  flows: ["auth"],
  bodySchema: requestBodySchema,
  responseSchema: responseSchema,
};

// @ts-ignore
export const handler: Handlers["auth.signup"] = async (req, ctx) => {
  const { email, password } = requestBodySchema.parse(req.body);

  await connectDB();

  const isUserExists: IUser | null = await User.findOne({ email });
  if (!isUserExists) {
    return {
      status: 404,
      body: { error: "User not found" },
    };
  }

  const isValidPassword = await bcrypt.compare(password, isUserExists.password);

  if (!isValidPassword) {
    return {
      status: 401,
      body: { error: "Invalid password" },
    };
  }

  const { accessToken, refreshToken } = generateTokens({
    id: isUserExists._id,
    username: isUserExists.username,
    email: isUserExists.email,
  });

  isUserExists.refreshToken = refreshToken;
  await isUserExists.save();

  return {
    status: 200,
    body: {
      accessToken,
      refreshToken,
    },
  };
};
