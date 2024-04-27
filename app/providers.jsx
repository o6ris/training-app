"use client";

import NextAuthProvider from "components/NextAuthProvider/NextAuthProvider";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children, session }) {
  return (
    <NextUIProvider>
      <NextAuthProvider session={session}>{children}</NextAuthProvider>
    </NextUIProvider>
  );
}
