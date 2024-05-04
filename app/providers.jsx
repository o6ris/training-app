"use client";

import NextAuthProvider from "components/NextAuthProvider/NextAuthProvider";
import { ProgramProvider } from "@modules/client/contexts/programProvider";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children, session }) {
  return (
    <NextUIProvider>
      <ProgramProvider>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
      </ProgramProvider>
    </NextUIProvider>
  );
}
