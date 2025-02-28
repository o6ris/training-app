"use client";

import { useContext, useTransition, useState } from "react";
import classes from "./savedSessions.module.css";
import SessionContext from "@modules/client/contexts/sessionProvider";
import useExercises from "@modules/client/requests/useExercises";
import useWorkoutSession from "@modules/client/requests/useWorkoutSession";
import { Accordion, AccordionItem, Avatar } from "@heroui/react";
import ButtonLink from "@core/ui/Button/ButtonLink";
import DeleteButton from "@components/DeleteButton/DeleteButton";
import ClipLoader from "react-spinners/ClipLoader";

function SavedSession({ workouts }) {
  const [isPending, startTransition] = useTransition();
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const { createSession } = useContext(SessionContext);
  const { latestExercises, setLatestExercises, setExerciseIds } =
    useExercises();
  const { deleteSession } = useWorkoutSession();
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

  return (
    <Accordion
      variant="splitted"
      selectedKeys={accordionKey}
      onSelectionChange={(key) => accordionOnChange(key)}
    >
      {workouts.map((workout, i) => {
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
                <DeleteButton
                  content={"Do you really want to delete this session?"}
                  onConfirm={() => deleteSession(workout._id)}
                />
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
