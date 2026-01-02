"use client";

import { useState } from "react";
import Button from "@components/button/Button";
import logger from "@utils/logger";
import { useAuth } from "@auth/AuthContext";
import {
  buildSignInUrl,
  isEmbedded,
  openAuthWindow,
} from "@utils/embed-context";

export default function SignInButton({
  className,
  style,
  text = "Continue with Google",
  title = "Sign in with Google",
}) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      if (isEmbedded()) {
        openAuthWindow(buildSignInUrl("/profile"));
        return;
      }
      login();
    } catch (err) {
      logger.error("Google sign-in exception", err);
      alert(`Google sign-in exception: ${err}`);
    }
    setLoading(false);
  };

  return (
    <Button
      text={loading ? "Sign In..." : text}
      onClick={handleGoogleLogin}
      disabled={loading}
      className={className}
      style={style}
      title={title}
    />
  );
}
