import classes from "./createSessionPage.module.css";
import CreateSession from "@components/CreateSession/CreateSession";
import GoBackButton from "@components/GoBackButton/GoBackButton";

async function CreateSessionPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const muscleResponse = await fetch(`${baseUrl}/api/muscles`, {
    method: "GET",
  });
  const muscles = await muscleResponse.json();
  return (
    <div className={classes.main_container}>
      <div className={classes.header}>
        <GoBackButton url="/workouts" />
        <h1>Create your Session</h1>
      </div>
      <CreateSession muscles={muscles} />
    </div>
  );
}

export default CreateSessionPage;
