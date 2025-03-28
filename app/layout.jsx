import "./globals.css";
import "./variables.css";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import Navigation from "@components/Navigation/Navigation";


const APP_NAME = "Grindpal";
const APP_DEFAULT_TITLE = "Grindpal";
const APP_TITLE_TEMPLATE = "%s - Grindpal";
const APP_DESCRIPTION = "Web application designed for seamless workout tracking. Log workouts effortlessly, monitor progress over time, and analyze performance through interactive charts, all in one platform";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // interactiveWidget="resizes-content"
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers session={session}>
          {children}
          {session && <Navigation />}
        </Providers>
      </body>
    </html>
  );
}
