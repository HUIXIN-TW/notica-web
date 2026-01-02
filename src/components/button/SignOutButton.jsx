"use client";
import React from "react";
import Button from "@components/button/Button";
import { useAuth } from "@auth/AuthContext";

const SignOutButton = ({ className, style, text = "Sign Out", title }) => {
  const { logout } = useAuth();

  return (
    <Button
      text={text}
      onClick={logout}
      className={className}
      style={style}
      title={title}
    />
  );
};

export default SignOutButton;
