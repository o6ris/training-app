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
        series: [
          {
            reps: 0,
            weight: 0,
          },
        ],
      });
    });
    setSession(exercisesList);
  };

  const handleArrayOnChange = (name, value, i, array) => {
    const updatedIndex = { ...array[i], [name]: value };
    array[i] = updatedIndex;
  };

  const handleOnChangeSession = (name, value, index, section) => {
    console.log("index", index);
    const tempSession = { ...program };
    if (section) {
      const updatedArray = [...tempSession[section]];
      handleArrayOnChange(name, value, index, updatedArray);
      tempSession[section] = updatedArray;
    } else {
      tempSession[name] = value;
    }
    localStorage.setItem("program", JSON.stringify(tempSession));
    setProgram(tempSession);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        createSession,
        handleOnChangeSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
