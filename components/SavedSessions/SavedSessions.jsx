"use client";

import { useContext, useTransition, useState } from "react";
import classes from "./savedSessions.module.css";
import SessionContext from "@modules/client/contexts/sessionProvider";
import useExercises from "@modules/client/requests/useExercises";
import useWorkoutSession from "@modules/client/requests/useWorkoutSession";
import { Accordion, AccordionItem, Avatar } from "@heroui/react";
import InputField from "@core/ui/Fields/InputField/InputField";
import ButtonLink from "@core/ui/Button/ButtonLink";
import DeleteButton from "@components/DeleteButton/DeleteButton";
import EditButton from "@components/EditButton/EditButton";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import ClipLoader from "react-spinners/ClipLoader";

function SavedSession() {
  const [isPending, startTransition] = useTransition();
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const { createSession } = useContext(SessionContext);
  const { latestExercises, setLatestExercises, setExerciseIds } =
    useExercises();
  const {
    workouts,
    deleteSession,
    updateSession,
    changeWorkoutName,
    setWorkouts,
    tempWorkouts,
  } = useWorkoutSession();
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

  const accordionOnChange = (key) => {
    if (Array.from(key).join("").length > 0) {
      const workout = workouts?.find(
        (workout) => workout._id === Array.from(key).join("")
      );
      const exerciseIds = workout?.exercises.map((exercise) => exercise._id);
      setExerciseIds(exerciseIds);
    } else {
      setExerciseIds([]);
      setLatestExercises([]);
    }
    setAccordionKey(key);
  };

  if (!workouts) {
    return (
      <div className={classes.skeleton_container}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index} // Assign a unique key for each Skeleton
            height={"5rem"}
            width={"100%"}
            className={`${classes.accordion_item}`}
          />
        ))}
      </div>
    );
  }
  return (
    <Accordion
      variant="splitted"
      selectedKeys={accordionKey}
      onSelectionChange={(key) => accordionOnChange(key)}
    >
      {workouts?.map((workout, i) => {
        return (
          <AccordionItem
            key={workout._id}
            aria-label={workout.name}
            title={
              <div className={classes.title_wrapper}>
                <div className={classes.title}>
                  {workout.name}
                  <span>{workout.exercises.length} exercises</span>
                </div>
                <div className={classes.action_buttons}>
                  <EditButton
                    content={
                      <div className={classes.save_session_modal}>
                        <InputField
                          value={workout.name}
                          onChange={(value) => {
                            return changeWorkoutName(
                              "name",
                              value,
                              workout._id
                            );
                          }}
                          labelPlacement="outside"
                          label="Session name"
                          labelStyle={classes.session_name_label}
                        />
                      </div>
                    }
                    disableConfirm={
                      workout.name ===
                      tempWorkouts.find(
                        (tempWorkout) => tempWorkout._id === workout._id
                      ).name
                    }
                    onConfirm={() => updateSession(workout._id, workout)}
                    onCancel={() => setWorkouts(tempWorkouts)}
                  />
                  <DeleteButton
                    content={"Do you really want to delete this session?"}
                    onConfirm={() => deleteSession(workout._id)}
                  />
                </div>
              </div>
            }
            classNames={{
              base: classes.accordion_item,
              title: classes.accordion_title,
            }}
          >
            {workout.exercises.map((exercise) => {
              return (
                <div
                  key={exercise._id}
                  className={classes.exercise_desc_content}
                >
                  <div className={classes.exercise_title}>
                    <Avatar
                      showFallback
                      className="w-12 h-12"
                      name={exercise?.name}
                      src={`${cloudinaryUrl}${exercise?.image}`}
                    />
                    <h2>{exercise.name}</h2>
                  </div>
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
              );
            })}
            <ButtonLink
              url={"/session"}
              onAction={() =>
                startTransition(() => {
                  createSession(
                    workout.exercises.map((exercise) => exercise._id),
                    latestExercises
                  );
                })
              }
              buttonContent={
                isPending ? (
                  <ClipLoader
                    color={"#EDF1FF"}
                    loading={isPending}
                    size={20}
                    aria-label="Loading Spinner"
                  />
                ) : (
                  "Start session"
                )
              }
              buttonStyle={classes.start_button}
            />
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default SavedSession;
