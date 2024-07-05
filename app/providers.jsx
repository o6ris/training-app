"use client";

import NextAuthProvider from "components/NextAuthProvider/NextAuthProvider";
import { SessionProvider } from "@modules/client/contexts/sessionProvider";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children, session }) {
  return (
    <NextUIProvider>
      <SessionProvider>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
      </SessionProvider>
    </NextUIProvider>
  );
}
