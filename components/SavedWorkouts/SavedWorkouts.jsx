"use client";

import { useContext, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import classes from "./savedWorkouts.module.css";
import WorkoutContext from "@modules/client/contexts/workoutProvider";
import useExercises from "@modules/client/requests/useExercises";
import useWorkoutSession from "@modules/client/requests/useWorkoutSession";
import { Accordion, AccordionItem, Avatar } from "@heroui/react";
import ButtonLink from "@core/ui/Button/ButtonLink";
import DeleteButton from "@components/DeleteButton/DeleteButton";
import BasicButton from "@core/ui/Button/BasicButton";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import Icon from "@core/ui/Icons/Icon";
import ClipLoader from "react-spinners/ClipLoader";

function SavedWorkouts() {
  const [isPending, startTransition] = useTransition();
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const { initAndCacheWorkout } = useContext(WorkoutContext);
  const { latestExercises, setLatestExercises, setsetSelectedExercises } =
    useExercises();
  const { workouts, deleteWorkoutSession } = useWorkoutSession();
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}`

  const router = useRouter();

  const accordionOnChange = (key) => {
    if (Array.from(key).join("").length > 0) {
      const workout = workouts?.find(
        (workout) => workout._id === Array.from(key).join("")
      );
      const exerciseIds = workout?.exercises.map((exercise) => exercise._id);
      setsetSelectedExercises(exerciseIds);
    } else {
      setsetSelectedExercises([]);
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
      style={{ padding: 0 }}
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
                  <BasicButton
                    isIconOnly={true}
                    startContent={
                      <Icon
                        name="Pencil"
                        size={16}
                        color="#1c2647"
                        strokeWidth={2}
                      />
                    }
                    onAction={() =>
                      router.push(`/workouts/create-session?id=${workout._id}`)
                    }
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
                      src={`${imageUrl}${exercise?.image}`}
                    />
                    <h2>{exercise.name}</h2>
                  </div>
                  {/* TODO: Rework this for better ui */}
                  {/* <div>
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
                  </div> */}
                </div>
              );
            })}
            <div className={classes.footer_button}>
              <ButtonLink
                url={"/session"}
                onAction={() =>
                  startTransition(() => {
                    initAndCacheWorkout(
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
                    "Start"
                  )
                }
                buttonStyle={classes.start_button}
              />
              <DeleteButton
                content={"Do you really want to delete this session?"}
                onConfirm={() => deleteWorkoutSession(workout._id)}
              />
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default SavedWorkouts;
