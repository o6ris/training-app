import { getServerSession } from "next-auth";
import GoBackButton from "@components/GoBackButton/GoBackButton";
import SavedSessions from "@components/SavedSessions/SavedSessions";
import classes from "./savedSessionPage.module.css";

async function SavedSessionsPage() {
  const session = await getServerSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const workoutsResponse = await fetch(
    `${baseUrl}/api/sessions?email=${session?.user.email}`,
    {
      method: "GET",
    }
  );
  const workouts = await workoutsResponse.json();

  return (
    <div className={classes.main_container}>
      <div className={classes.header}>
        <GoBackButton url="/workouts" />
        <h1>Your saved Sessions</h1>
      </div>
      <SavedSessions workouts={workouts} />
    </div>
  );
}

export default SavedSessionsPage;
