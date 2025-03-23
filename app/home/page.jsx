import classes from "./home.module.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Header from "@components/Home/Header";
import Hero from "@components/Home/Hero";
import Benefits from "@components/Home/Benefits";
import Chart from "@components/Home/Chart";
import WorkoutCalendar from "@components/Home/Protected/WorkoutCalendar";

export const metadata = {
  title: "GrindPAL | Track your fitness progress",
  description:
    "Track your workouts at the gym and monitor your progress with GrindPAL.",
  keywords: "workout, fitness, strength training, progress tracker, gym",

  openGraph: {
    title: "GrindPAL | Track your fitness progress",
    description:
      "Track your workouts at the gym and monitor your progress with GrindPAL.",
    url: "https://grind-pal.vercel.app",
    siteName: "GrindPAL",
    // images: [
    //   {
    //     url: "/cover.jpg",
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "GrindPAL | Track your fitness progress",
    description:
      "Track your workouts at the gym and monitor your progress with GrindPAL.",
    // images: ["/cover.jpg"],
  },
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className={classes.main_wrapper}>
      {session ? (
        <>
          <WorkoutCalendar />
        </>
      ) : (
        <>
          <Header session={session} />
          <Hero session={session} />
          <Benefits />
          <Chart session={session} />
        </>
      )}
    </main>
  );
}
