"use client";

import { useState, useEffect, useContext } from "react";
import classes from "./createSession.module.css";
import SessionContext from "@modules/client/contexts/sessionProvider";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import ButtonLink from "@core/ui/Button/ButtonLink";
import useStats from "@modules/client/userRequests/useStats";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/userRequests/useUser";
import Image from "next/image";

function CreateSession() {
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);
  const { getLatestStatByExercise, latestExercises } = useStats(userId);
  const [muscles, setMuscles] = useState([]);
  const [muscleIds, setMusculeIds] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseIds, setExerciseIds] = useState([]);
  const { createSession, session } = useContext(SessionContext);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getMuscles = async () => {
    try
    {
      const response = await fetch(
        `${baseUrl}/api/muscles`,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response)
      {
        const muscles = await response.json();
        if (muscles)
        {
          setMuscles(muscles);
        }
      }
    } catch (err)
    {
      throw err;
    }
  };

  const getExercises = async () => {
    try
    {
      const queryString = muscleIds
        .map((muscleId) => `muscle=${muscleId}`)
        .join("&");
      const url = `${baseUrl}/api/exercises?${queryString}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response)
      {
        const exercises = await response.json();
        if (exercises)
        {
          setExercises(exercises);
        }
      }
    } catch (err)
    {
      throw err;
    }
  };

  useEffect(() => {
    getMuscles();
  }, []);

  useEffect(() => {
    if (muscleIds.length > 0)
    {
      getExercises();
    }
  }, [muscleIds]);

  useEffect(() => {
    getLatestStatByExercise(exerciseIds);
  }, [exerciseIds]);

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
            };
          })}
          label="Muscle"
          placeholder="Choose muscle"
          labelPlacement="outside"
          variant="bordered"
          selectOnChange={(value) => setMusculeIds(Array.from(value))}
          value={muscleIds}
          isMultiline={true}
          selectionMode="multiple"
        />
        {/* Choose Exercises */}
        {muscleIds.length > 0 && (
          <SelectField
            items={exercises?.map((exercise) => {
              return {
                key: exercise._id,
                value: `${exercise.name
                  .charAt(0)
                  .toUpperCase()}${exercise.name.slice(1)}`,
                image: exercise.image
              };
            })}
            hasImage={true}
            label="Exercises"
            placeholder="Choose exercises"
            labelPlacement="outside"
            variant="bordered"
            selectOnChange={(value) => setExerciseIds(Array.from(value))}
            value={exerciseIds}
            isMultiline={true}
            selectionMode="multiple"
          />
        )}
      </div>
      <div>
        {selectedExercises.length > 0 &&
          selectedExercises.map((exercise, i) => {
            return (
              <div className={classes.exercise_desc} key={i}>
                <div className={classes.exercise_desc_header}>
                  <h2>{exercise.name}</h2>
                  <Image
                    src={`/${exercise.image}`}
                    width={50}
                    height={50}
                    alt="Picture of the author"
                  />
                </div>
                <div className={classes.exercise_desc_content}>
                  <p>{exercise.description.steps}</p>
                  <p>{exercise.description.benefits}</p>
                  <p>{exercise.description.mistakes}</p>
                </div>
              </div>
            );
          })}
      </div>
      {exerciseIds.length > 0 && (
        <ButtonLink
          url={"/session"}
          // pass as an argument list of latests exercises
          onAction={() => createSession(exerciseIds, latestExercises)}
          buttonContent={"Create session"}
          buttonStyle={classes.add_session_button}
        />
      )}
    </>
  );
}

export default CreateSession;
