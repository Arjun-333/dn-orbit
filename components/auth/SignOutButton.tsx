"use client";

import { signOut } from "next-auth/react";
import React from "react";

interface SignOutButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function SignOutButton({ children, className }: SignOutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={className}
    >
      {children}
    </button>
  );
}
