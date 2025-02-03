"use client";

import NextAuthProvider from "components/NextAuthProvider/NextAuthProvider";
import { SessionProvider } from "@modules/client/contexts/sessionProvider";
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children, session }) {
  return (
    <HeroUIProvider>
      <SessionProvider>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
      </SessionProvider>
    </HeroUIProvider>
  );
}
