import { useState } from "react";
import classes from "./exercisesList.module.css";
import { Avatar, Image } from "@heroui/react";
import PopupButton from "@core/ui/Button/PopupButton";

function ExerciseList({ exercises, setExerciseIds, exerciseIds }) {
  const addExercise = (exercise) => {
    setExerciseIds((prevExercises) => [...prevExercises, exercise]);
  };
  const removeExercise = (exercise) => {
    setExerciseIds((prevExercises) =>
      prevExercises.filter((item) => item !== exercise)
    );
  };
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
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
                    src={`${cloudinaryUrl}${exercise?.image}`}
                  />
                  <p>{exercise.name}</p>
                </>
              }
              closebutton={"Close"}
              confirmButton={
                exerciseIds?.includes(exercise._id) ? "Remove" : "Add"
              }
              onConfirm={() =>
                exerciseIds?.includes(exercise._id)
                  ? removeExercise(exercise._id)
                  : addExercise(exercise._id)
              }
              content={
                <div className={classes.exercise_desc_content}>
                  <Image
                    isZoomed
                    src={`${cloudinaryUrl}${exercise?.image}`}
                    alt={exercise?.name}
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
          </div>
        );
      })}
    </div>
  );
}

export default ExerciseList;
