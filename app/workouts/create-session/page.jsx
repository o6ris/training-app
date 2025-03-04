import classes from "./createWorkoutPage.module.css";
import CreateWorkout from "@components/CreateWorkout/CreateWorkout";

async function CreateWorkoutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const muscleResponse = await fetch(`${baseUrl}/api/muscles`, {
    method: "GET",
  });
  const muscles = await muscleResponse.json();
  return (
    <div className={classes.main_container}>
      <CreateWorkout muscles={muscles} />
    </div>
  );
}

export default CreateWorkoutPage;
