import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/requests/useUser";
import useStats from "@modules/client/requests/useStats";

export default function useExercises() {

  const { data: userSession } = useSession();
  const { userId } = useUser(userSession);
  const { getLatestStatByExercise, latestExercises } = useStats(userId);
  const [muscleIds, setMusculeIds] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseIds, setExerciseIds] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getExercises = async () => {
    try {
      setisLoading(true)
      const queryString = muscleIds
        .map((muscleId) => `muscle=${muscleId}`)
        .join("&");
        console.log("query", queryString)
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
      setisLoading(false)
    }
  };

  useEffect(() => {
    if (muscleIds.length > 0) {
      getExercises();
    } else {
      setExerciseIds([])
    }
  }, [muscleIds]);

  useEffect(() => {
    getLatestStatByExercise(exerciseIds);
  }, [exerciseIds]);

  return {
    setMusculeIds,
    muscleIds,
    setExerciseIds,
    exerciseIds,
    latestExercises,
    exercises,
    isLoading,
  };
}
