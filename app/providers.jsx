"use client";

import NextAuthProvider from "components/NextAuthProvider/NextAuthProvider";
import { SessionProvider } from "@modules/client/contexts/sessionProvider";
import { NotificationProvider } from "@modules/client/contexts/toastNotificationProvider";
import { HeroUIProvider } from "@heroui/react";
import ToastBar from "@core/ui/Toast/ToastBar";

export function Providers({ children, session }) {
  return (
    <HeroUIProvider>
      <SessionProvider>
        <NotificationProvider>
          <ToastBar />
          <NextAuthProvider session={session}>{children}</NextAuthProvider>
        </NotificationProvider>
      </SessionProvider>
    </HeroUIProvider>
  );
}
