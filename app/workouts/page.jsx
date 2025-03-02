import classes from "./workouts.module.css";
import ButtonLink from "@core/ui/Button/ButtonLink";
import SavedSession from "@components/SavedSessions/SavedSessions";

export default async function Workouts() {

  return (
    <div className={classes.main_container}>
      <h1>Workouts</h1>
      <div className={classes.header_button}>
        <ButtonLink
          url={"/workouts/create-session"}
          buttonContent="+ Create workout"
          buttonStyle={classes.create_link}
        />
      </div>
      <hr className={classes.hr} />
      <h2>Saved workouts</h2>
      <SavedSession />
    </div>
  );
}
