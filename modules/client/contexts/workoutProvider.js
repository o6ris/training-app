import { createContext, useState } from "react";

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [session, setSession] = useState([]);
  const [exercisesId, setExercisesId] = useState([]);

  const initAndCacheWorkout = (exercises, latestExercises) => {
    const exercisesList = [];
    const exercisesId = [];
    exercises.forEach((exercise) => {
      const similarExercise = latestExercises.find(
        (el) => el.exercise === exercise
      );
      if (similarExercise) {
        exercisesList.push(similarExercise);
        exercisesId.push(similarExercise.exercise);
      } else {
        exercisesList.push({
          exercise: exercise,
          restTime: 60,
          trainingTime: 0,
          rm: 0,
          sets: [
            {
              reps: 0,
              weight: 0,
            },
          ],
          isFinished: false,
        });
        exercisesId.push(exercise);
      }
    });
    setSession(exercisesList);
    setExercisesId(exercisesId);
    localStorage.setItem("session", JSON.stringify(exercisesList));
    localStorage.setItem("exercisesId", JSON.stringify(exercisesId));
  };

  const handleOnChangeSession = (name, value, index) => {
    const tempSession = [...session];
    const tempExercise = tempSession[index];
    tempExercise[name] = value;
    tempSession[index] = tempExercise;
    setSession(tempSession);
    localStorage.setItem("session", JSON.stringify(tempSession));
  };

  const handleOnchangeSets = (name, value, exerciseIndex, setIndex) => {
    const tempSession = [...session];
    const tempExercise = tempSession[exerciseIndex];
    const tempSets = [...tempExercise.sets];
    tempSets[setIndex] = {
      ...tempSets[setIndex],
      [name]: value,
    };
    tempExercise.sets = tempSets;
    tempSession[exerciseIndex] = tempExercise;
    setSession(tempSession);
    localStorage.setItem("session", JSON.stringify(tempSession));
  };

  const handleAddSets = (name, value, index) => {
    // Validate that value is between 1 and 9
    if (value >= 0 && value < 10) {
      const newSet = {
        reps: 0,
        weight: 0,
      };
      const tempSession = [...session];
      const tempExercise = { ...tempSession[index] };
      const currentLength = tempExercise[name].length;
      if (value > currentLength) {
        const setsToAdd = Array(value - currentLength).fill(newSet);
        tempExercise[name] = [...tempExercise[name], ...setsToAdd];
      } else {
        tempExercise[name] = tempExercise[name].slice(0, value);
      }
      tempSession[index] = tempExercise;
      setSession(tempSession);
    } else {
      console.warn("Value must be between 1 and 9.");
    }
  };

  const resetExercise = (index) => {
    const tempSession = [...session];
    tempSession[index] = {
      exercise: session[index].exercise,
      restTime: 60,
      trainingTime: 0,
      rm: 0,
      sets: [
        {
          reps: 0,
          weight: 0,
        },
      ],
      isFinished: false,
    };
    setSession(tempSession);
    localStorage.setItem("session", JSON.stringify(tempSession));
  };

  return (
    <WorkoutContext.Provider
      value={{
        session,
        setSession,
        initAndCacheWorkout,
        handleOnChangeSession,
        handleAddSets,
        handleOnchangeSets,
        resetExercise,
        exercisesId,
        setExercisesId,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;
