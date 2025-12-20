import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";
import type { AuthTokens } from "types/auth.d";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post<AuthTokens>(
        `${import.meta.env.VITE_API_ENDPOINT}/auth/signup`,
        {
          email,
          password,
        },
      );

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      console.log("Signup successful", response);
      toast.success("Signup successful");
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
      toast.error("Signup failed, try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Toaster position="top-center" />
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">MyNovel.ai</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to MyNovel.ai</h1>
            <FieldDescription>
              Already have an account? <a href="/signin">Sign in</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            {!isLoading ? (
              <Button type="submit" onClick={handleSubmit}>
                Create Account
              </Button>
            ) : (
              <Button disabled>Loading...</Button>
            )}
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
