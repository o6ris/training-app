import classes from "./exercisesList.module.css";
import { Avatar, Image } from "@heroui/react";
import NextImage from "next/image";
import DeleteButton from "@components/DeleteButton/DeleteButton";
import PopupButton from "@core/ui/Button/PopupButton";

function ExerciseList({
  exercises,
  addExercise,
  removeExercise,
  exercisesToDisplay,
  workoutId,
  addWorkoutExercise,
  deleteWorkoutExercise,
  oneWorkout,
}) {
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}`;

  const exerciseIds = exercisesToDisplay.map((exercise) => exercise._id);

  return (
    <div className={classes.list_wrapper}>
      {exercises?.map((exercise) => {
        return (
          <div className={classes.select_item} key={exercise._id}>
            <PopupButton
              buttonStyle={classes.select_button}
              triggerButtonContent={
                <>
                  <Avatar
                    showFallback
                    name={exercise.name}
                    src={`${imageUrl}${exercise?.image}`}
                  />
                  <p>{exercise.name}</p>
                </>
              }
              closebutton={"Close"}
              confirmButton={"Add"}
              onConfirm={
                workoutId
                  ? () => addWorkoutExercise(exercise)
                  : () => addExercise(exercise)
              }
              isDisabled={exerciseIds?.includes(exercise._id)}
              content={
                <div className={classes.exercise_desc_content}>
                  <Image
                    as={NextImage}
                    isZoomed
                    src={`${imageUrl}${exercise?.image}`}
                    alt={exercise?.name}
                    height={300}
                    width={300}
                  />
                  <div>
                    <h3>Steps:</h3>
                    <p>{exercise.description.steps}</p>
                  </div>
                  <div>
                    <h3>Benefits:</h3>
                    <p>{exercise.description.benefits}</p>
                  </div>
                  <div>
                    <h3>Mistakes</h3>
                    <p>{exercise.description.mistakes}</p>
                  </div>
                </div>
              }
            />
            {exerciseIds?.includes(exercise._id) && (
              <DeleteButton
                content={"Do you really want to remove this exercise?"}
                onConfirm={
                  workoutId
                    ? () => deleteWorkoutExercise(exercise._id)
                    : () => removeExercise(exercise._id)
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ExerciseList;
