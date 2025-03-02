"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./setupWorkout.module.css";
import { useSession } from "next-auth/react";
import { Accordion, AccordionItem, Avatar, Image } from "@heroui/react";
import useWorkoutSession from "@modules/client/requests/useWorkoutSession";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import DeleteButton from "@components/DeleteButton/DeleteButton";
import Icon from "@core/ui/Icons/Icon";

function SetupWorkout({
  selectedExercises,
  setDisplayAddExercise,
  removeExercise,
}) {
  const { data: session } = useSession();
  const [sessionName, setSessionName] = useState("");
  const { saveSession } = useWorkoutSession();
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const router = useRouter();
  
  const exerciseIds = selectedExercises.map((exercise) => exercise._id);
  console.log("sessionName", sessionName)
  console.log("exerciseIds", exerciseIds)
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
        value={sessionName}
        onChange={(value) => setSessionName(value)}
      />
      {selectedExercises.length > 0 &&
        selectedExercises.map((exercise, i) => {
          return (
            <div className={classes.exercise_desc} key={i}>
              <Accordion>
                <AccordionItem
                  key={i + 1}
                  aria-label={exercise.name}
                  startContent={
                    <Avatar
                      isBordered
                      showFallback
                      name={exercise.name}
                      src={`${cloudinaryUrl}${exercise?.image}`}
                    />
                  }
                  title={
                    <div className={classes.accordion_title}>
                      {exercise.name}
                      <DeleteButton
                        content={"Do you really want to remove this exercise?"}
                        onConfirm={() => removeExercise(exercise)}
                      />
                    </div>
                  }
                >
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
          isDisabled={sessionName.length < 1 || exerciseIds.length === 0}
          buttonContent="Save"
          buttonStyle={classes.save_session_button}
          startContent={
            <Icon name="Save" size={16} color="#edf1ff" strokeWidth={2} />
          }
          onAction={() =>
            saveSession(session.user.email, sessionName, exerciseIds)
          }
        />
      </div>
    </div>
  );
}

export default SetupWorkout;
