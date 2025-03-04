import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/requests/useUser";
import useStats from "@modules/client/requests/useStats";

export default function useExercises(list, queryName) {
  const { data: userSession } = useSession();
  const { userId } = useUser(userSession);
  const [latestExercises, setLatestExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setsetSelectedExercises] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getExercisesByMuscles = async () => {
    try {
      setisLoading(true);
      const queryString = list
        .map((query) => `${queryName}=${query}`)
        .join("&");
      const url = `${baseUrl}/api/exercises?${queryString}`;
      const response = await fetch(url, { method: "GET" });
      if (response) {
        const exercises = await response.json();
        if (exercises) {
          setExercises(exercises);
        }
      }
    } catch (err) {
      throw err;
    } finally {
      setisLoading(false);
    }
  };

  const getStatsByExercises = async () => {
    try {
      const queryString = selectedExercises
        .map((exerciseId) => `exercise=${exerciseId}`)
        .join("&");
      const url = `${baseUrl}/api/stats/lastStatByExercise?user=${userId}&${queryString}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const stats = (await response.json()) ?? [];
        const latestExercises = stats.map((element) => ({
          trainingTime: 0,
          restTime: element.rest_time,
          isFinished: false,
          exercise: element.exercise._id,
          sets: element.sets,
          rm: element.rm,
        }));

        setLatestExercises(latestExercises);
      }
    } catch (error) {
      throw error;
    }
  };

  const addExercise = (exercise) => {
    setsetSelectedExercises((prevExercises) => [...prevExercises, exercise]);
  };
  const removeExercise = (exercise) => {
    setsetSelectedExercises((prevExercises) =>
      prevExercises.filter((item) => item !== exercise)
    );
  };

  useEffect(() => {
    if (list?.length > 0) {
      getExercisesByMuscles();
    } else {
      setsetSelectedExercises([]);
    }
  }, [list]);

  useEffect(() => {
    if (selectedExercises?.length > 0) getStatsByExercises(selectedExercises);
  }, [selectedExercises]);

  return {
    setsetSelectedExercises,
    selectedExercises,
    exercises,
    isLoading,
    addExercise,
    removeExercise,
    latestExercises,
    setLatestExercises,
  };
}
