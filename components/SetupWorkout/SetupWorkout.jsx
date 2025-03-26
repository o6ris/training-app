"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./setupWorkout.module.css";
import { useSession } from "next-auth/react";
import { Accordion, AccordionItem, Image } from "@heroui/react";
import NextImage from "next/image";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import DeleteButton from "@components/DeleteButton/DeleteButton";
import Icon from "@core/ui/Icons/Icon";

function SetupWorkout({
  selectedExercises,
  setDisplayAddExercise,
  removeExercise,
  workoutId,
  saveWorkoutSession,
  updateWorkoutSession,
  oneWorkout,
  changeOneWorkoutName,
  deleteWorkoutExercise,
}) {
  const { data: session } = useSession();
  const [workoutName, setWorkoutName] = useState("");

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}`;
  const router = useRouter();
  const exerciseIds = workoutId
    ? oneWorkout?.exercises.map((exercise) => exercise._id)
    : selectedExercises.map((exercise) => exercise._id);
  const exercisesToDisplay = workoutId
    ? oneWorkout?.exercises
    : selectedExercises;

  return (
    <div className={classes.main_wrapper}>
      <InputField
        placeholder="Workout name"
        variant="bordered"
        ariaLabel="workout name"
        classNames={{
          inputWrapper: classes.workout_name_input,
          input: classes.workout_name_value,
        }}
        value={workoutId ? oneWorkout?.name : workoutName}
        onChange={
          workoutId
            ? (value) => changeOneWorkoutName(value)
            : (value) => setWorkoutName(value)
        }
      />
      {exercisesToDisplay?.length > 0 &&
        exercisesToDisplay.map((exercise, i) => {
          return (
            <div className={classes.exercise_desc} key={i}>
              <Accordion>
                <AccordionItem
                  key={i + 1}
                  aria-label={exercise.name}
                  startContent={
                    <Image
                      as={NextImage}
                      src={exercise?.tiny_image}
                      alt={exercise?.name}
                      height={40}
                      width={40}
                      unoptimized={true}
                      loading="lazy"
                    />
                  }
                  title={
                    <div className={classes.accordion_title}>
                      {exercise.name}
                      <DeleteButton
                        content={"Do you really want to remove this exercise?"}
                        onConfirm={
                          workoutId
                            ? () => deleteWorkoutExercise(exercise._id)
                            : () => removeExercise(exercise)
                        }
                        confirmButton="Remove"
                      />
                    </div>
                  }
                >
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
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      <BasicButton
        buttonStyle={classes.add_exercises_button}
        buttonContent="add exercises"
        startContent={<Icon name="Plus" strokeWidth={2} color="#2694f9" />}
        onAction={() => setDisplayAddExercise(true)}
      />
      <div className={classes.footer_button}>
        <BasicButton
          buttonContent="Cancel"
          buttonStyle={classes.cancel_button}
          onAction={() => router.push("/workouts")}
        />
        <BasicButton
          isDisabled={
            workoutId
              ? oneWorkout?.name.length < 1 || exercisesToDisplay?.length === 0
              : workoutName.length < 1 || exercisesToDisplay?.length === 0
          }
          buttonContent="Save"
          buttonStyle={classes.save_session_button}
          startContent={
            <Icon name="Save" size={16} color="#edf1ff" strokeWidth={2} />
          }
          onAction={() => {
            if (workoutId) {
              updateWorkoutSession(oneWorkout._id, oneWorkout);
            } else {
              saveWorkoutSession(session.user.email, workoutName, exerciseIds);
            }
          }}
        />
      </div>
    </div>
  );
}

export default SetupWorkout;
