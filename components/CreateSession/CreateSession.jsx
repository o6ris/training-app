"use client";

import { useState, useContext, useTransition } from "react";
import classes from "./createSession.module.css";
import useExercises from "@modules/client/requests/useExercises";
import SessionContext from "@modules/client/contexts/sessionProvider";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import ExerciseList from "@components/ExercisesList/ExerciseList";
import ButtonLink from "@core/ui/Button/ButtonLink";
import { Accordion, AccordionItem, Avatar, Image } from "@heroui/react";
import ClipLoader from "react-spinners/ClipLoader";
import Icon from "@core/ui/Icons/Icon";
import PopupButton from "@core/ui/Button/PopupButton";

function CreateSession({ muscles }) {
  const { createSession, session } = useContext(SessionContext);
  const [muscleIds, setMusculeIds] = useState([]);
  const [isPending, startTransition] = useTransition();
  const {
    exerciseIds,
    latestExercises,
    exercises,
    isLoading,
    addExercise,
    removeExercise,
  } = useExercises(muscleIds, "muscle");
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

  

  const selectedExercises = exercises.filter((exercise) => {
    return exerciseIds.includes(exercise._id);
  });

  return (
    <>
      <div className={classes.session_container}>
        {/* Choose muscles */}
        <SelectField
          items={muscles?.map((muscle) => {
            return {
              key: muscle._id,
              value: `${muscle.name.charAt(0).toUpperCase()}${muscle.name.slice(
                1
              )}`,
              image: muscle.image
            };
          })}
          label={
            <div className={classes.label_with_info}>
              <span>Choose Muscles</span>
              <PopupButton
                isIconOnly={true}
                startContent={
                  <Icon name="Info" size={16} color="white" strokeWidth={2} />
                }
                buttonStyle={classes.info_button}
                title={"Why Choose Muscles First When Creating Your Workout?"}
                closebutton={"Close"}
                content={
                  <div className={classes.modal_content}>
                    <p>
                      When building a workout session, it&apos;s important to
                      start by selecting the muscles you want to train.
                    </p>
                    <p>
                      Instead of randomly picking exercises, choosing your
                      target muscles first ensures that your workout is
                      structured and balanced.
                    </p>
                  </div>
                }
              />
            </div>
          }
          placeholder="eg: Chest, Legs, Arms, ..."
          labelPlacement="outside"
          variant="bordered"
          selectOnChange={(value) => setMusculeIds(Array.from(value))}
          value={muscleIds}
          isMultiline={true}
          selectionMode="multiple"
          hasImage={true}
        />
        {/* Choose Exercises */}
        {muscleIds.length > 0 && (
          <PopupButton
            isDisabled={isLoading}
            buttonStyle={classes.add_exercises_button}
            triggerButtonContent={
              isLoading ? (
                <ClipLoader
                  color={"#2694f9"}
                  loading={isLoading}
                  size={20}
                  aria-label="Loading Spinner"
                />
              ) : exerciseIds?.length > 0 ? (
                "Update Exercises"
              ) : (
                "+ Add exercises"
              )
            }
            closebutton={"Close"}
            size="full"
            isTransparent={true}
            content={
              <ExerciseList
                exercises={exercises}
                addExercise={addExercise}
                removeExercise={removeExercise}
                exerciseIds={exerciseIds}
              />
            }
          />
        )}
      </div>
      {selectedExercises.length > 0 &&
        muscleIds.length > 0 &&
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
                      <PopupButton
                        isIconOnly={true}
                        buttonStyle={classes.remove_button}
                        startContent={
                          <Icon
                            name="Trash"
                            size={16}
                            color="#ba0505"
                            strokeWidth={2}
                          />
                        }
                        content={"Do you really want to remove this exercise?"}
                        onConfirm={() => removeExercise(exercise._id)}
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
      {exerciseIds.length > 0 && (
        <ButtonLink
          url={"/session"}
          // pass as an argument list of latests exercises
          onAction={() =>
            startTransition(() => {
              createSession(exerciseIds, latestExercises);
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
              "Create session"
            )
          }
          buttonStyle={classes.add_session_button}
        />
      )}
    </>
  );
}

export default CreateSession;
