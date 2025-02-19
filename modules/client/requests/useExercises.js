import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/requests/useUser";
import useStats from "@modules/client/requests/useStats";

export default function useExercises(list, queryName) {
  const { data: userSession } = useSession();
  const { userId } = useUser(userSession);
  const { getLatestStatByExercise, latestExercises } = useStats(userId);
  const [exercises, setExercises] = useState([]);
  const [exerciseIds, setExerciseIds] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getExercises = async () => {
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

  const addExercise = (exercise) => {
    setExerciseIds((prevExercises) => [...prevExercises, exercise]);
  };
  const removeExercise = (exercise) => {
    setExerciseIds((prevExercises) =>
      prevExercises.filter((item) => item !== exercise)
    );
  };

  useEffect(() => {
    if (list.length > 0) {
      getExercises();
    } else {
      setExerciseIds([]);
    }
  }, [list]);

  useEffect(() => {
    getLatestStatByExercise(exerciseIds);
  }, [exerciseIds]);

  return {
    setExerciseIds,
    exerciseIds,
    latestExercises,
    exercises,
    isLoading,
    addExercise,
    removeExercise,
  };
}
