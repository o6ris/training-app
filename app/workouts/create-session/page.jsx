import CreateSession from "@components/CreateSession/CreateSession";
import classes from "./createSessionPage.module.css";

async function CreateSessionPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const muscleResponse = await fetch(`${baseUrl}/api/muscles`, {
    method: "GET",
  });
  const muscles = await muscleResponse.json();
  return (
    <div className={classes.main_container}>
      <h1>Create your Session</h1>
      <CreateSession muscles={muscles} />
    </div>
  );
}

export default CreateSessionPage