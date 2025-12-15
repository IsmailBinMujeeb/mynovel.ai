import { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { auth } from "../../middlewares/auth.middleware";
import { connectDB } from "../../../config/db";
import User, { IUser } from "../../../models/user.model";

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
  name: "auth.signout",
  description: "Sign out a user",
  path: "/auth/signout",
  method: "POST",
  emits: [],
  middleware: [auth({ required: true })],
  flows: ["auth"],
  responseSchema: responseSchema,
};

// @ts-ignore
export const handler: Handlers["auth.signout"] = async (req, ctx) => {
  // @ts-ignore
  const user = req.user;

  await connectDB();
  const updatedUser = (await User.findByIdAndUpdate(user?.id, {
    $unset: { refreshToken: 1 },
  })) as IUser;

  if (!updatedUser) {
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
