import CreateSession from "@components/CreateSession/CreateSession";
import classes from "./main.module.css";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const muscleResponse = await fetch(`${baseUrl}/api/muscles`, {
    method: "GET",
  });
  const muscles = await muscleResponse.json();

  return (
    <div className={classes.main_container}>
      <h1>Setup your Session</h1>
      <CreateSession muscles={muscles} />
    </div>
  );
}
