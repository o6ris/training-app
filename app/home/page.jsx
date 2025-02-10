import classes from "./home.module.css";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Header from "@components/Home/Header";
import Hero from "@components/Home/Hero";
import Benefits from "@components/Home/Benefits";
import Chart from "@components/Home/Chart";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className={classes.main_wrapper}>
      <Header session={session} />
      <Hero session={session} />
      <Benefits />
      <Chart session={session} />
    </main>
  );
}
