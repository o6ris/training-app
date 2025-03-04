"use client";

import NextAuthProvider from "components/NextAuthProvider/NextAuthProvider";
import { WorkoutProvider } from "@modules/client/contexts/workoutProvider";
import { NotificationProvider } from "@modules/client/contexts/toastNotificationProvider";
import { HeroUIProvider } from "@heroui/react";
import ToastBar from "@core/ui/Toast/ToastBar";

export function Providers({ children, session }) {
  return (
    <HeroUIProvider>
      <WorkoutProvider>
        <NotificationProvider>
          <ToastBar />
          <NextAuthProvider session={session}>{children}</NextAuthProvider>
        </NotificationProvider>
      </WorkoutProvider>
    </HeroUIProvider>
  );
}
