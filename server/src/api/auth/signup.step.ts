import { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { generateUsername } from "unique-username-generator";
import User, { IUser } from "../../../models/user.model";
import { generateTokens } from "../../../utils/generateTokens";
import { connectDB } from "../../../config/db";
import bcrypt from "bcrypt";

const requestBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

const responseSchema = {
  201: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  209: z.object({ error: z.string() }),
  401: z.object({ error: z.string() }),
  409: z.object({ error: z.string() }),
  500: z.object({ error: z.string() }),
};

export const config: ApiRouteConfig = {
  type: "api",
  name: "auth.signup",
  description: "Sign up a new user",
  path: "/auth/signup",
  method: "POST",
  emits: [],
  flows: ["auth"],
  bodySchema: requestBodySchema,
  responseSchema: responseSchema,
};

// @ts-ignore
export const handler: Handlers["auth.signup"] = async (req, ctx) => {
  const { email, password } = requestBodySchema.parse(req.body);
  const username = generateUsername();
  const avatar = `https://api.dicebear.com/7.x/micah/svg?seed=${username}`;

  await connectDB();

  const isUserExists = await User.exists({ email });
  if (isUserExists) {
    return {
      status: 409,
      body: { error: "User already exists" },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: IUser = new User({
    email,
    password: hashedPassword,
    username,
    avatar,
  });

  const { accessToken, refreshToken } = generateTokens({
    id: newUser._id,
    email,
    username,
  });

  newUser.refreshToken = refreshToken;
  await newUser.save();

  return {
    status: 201,
    body: {
      accessToken,
      refreshToken,
    },
  };
};
