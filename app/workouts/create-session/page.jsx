import classes from "./createSessionPage.module.css";
import CreateSession from "@components/CreateSession/CreateSession";

async function CreateSessionPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const muscleResponse = await fetch(`${baseUrl}/api/muscles`, {
    method: "GET",
  });
  const muscles = await muscleResponse.json();
  return (
    <div className={classes.main_container}>
      <CreateSession muscles={muscles} />
    </div>
  );
}

export default CreateSessionPage;
