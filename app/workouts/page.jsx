import classes from "./workouts.module.css";
import ButtonLink from "@core/ui/Button/ButtonLink";

export default async function Workouts() {

  return (
    <div className={classes.main_container}>
      <h1>Workouts</h1>
      <div className={classes.header_button}>
        <ButtonLink
          url={"/workouts/create-session"}
          buttonContent="+ Create Session"
          buttonStyle={classes.create_link}
        />
        <ButtonLink
          url={"/workouts/saved-sessions"}
          buttonContent="Saved Sessions"
          buttonStyle={classes.sessions_link}
        />
      </div>
    </div>
  );
}
