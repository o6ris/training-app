import { createContext, useState } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState([]);

  const createSession = (exercises) => {
    const exercisesList = [];
    exercises.forEach((exercise) => {
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
      });
    });
    setSession(exercisesList);
    localStorage.setItem("session", JSON.stringify(exercisesList));
  };

  // const handleArrayOnChange = (name, value, i, array) => {
  //   const updatedIndex = { ...array[i], [name]: value };
  //   array[i] = updatedIndex;
  // };

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
    const set = {
      reps: 0,
      weight: 0,
    };
    const tempSession = [...session];
    const tempExercise = tempSession[index];
    tempExercise[name] = Array.isArray(tempExercise[name])
      ? Array.from({ length: value }, () => ({ ...set }))
      : new Array(value).fill(set);

    tempSession[index] = tempExercise;
    setSession(tempSession);
    localStorage.setItem("session", JSON.stringify(tempSession));
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        createSession,
        handleOnChangeSession,
        handleAddSets,
        handleOnchangeSets,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
