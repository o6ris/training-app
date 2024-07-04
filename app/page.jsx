"use client";

import CreateSession from "@components/CreateSession/CreateSession";
import classes from "./main.module.css";

export default function Home() {
  return (
    <main className={classes.main_container}>
      <h1>Create Session</h1>
      <CreateSession />
    </main>
  );
}
