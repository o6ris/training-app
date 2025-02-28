import GoBackButton from "@components/GoBackButton/GoBackButton";
import SavedSessions from "@components/SavedSessions/SavedSessions";
import classes from "./savedSessionPage.module.css";

async function SavedSessionsPage() {

  return (
    <div className={classes.main_container}>
      <div className={classes.header}>
        <GoBackButton url="/workouts" />
        <h1>Your saved Sessions</h1>
      </div>
      <SavedSessions />
    </div>
  );
}

export default SavedSessionsPage;
