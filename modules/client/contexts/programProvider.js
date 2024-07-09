import { createContext, useState } from "react";

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const handleArrayOnChange = (name, value, i, array) => {
    const updatedIndex = { ...array[i], [name]: value };
    array[i] = updatedIndex;
  };

  const [program, setProgram] = useState({
    sessions: [
      {
        muscles: [],
        exercises: [],
        name: "",
        color: "",
      },
    ],
    frequency: 1,
  });

  const handleOnChangeProgram = (name, value, index, section) => {
    console.log("index", index);
    const tempProgram = { ...program };
    if (section) {
      const updatedArray = [...tempProgram[section]];
      handleArrayOnChange(name, value, index, updatedArray);
      tempProgram[section] = updatedArray;
    } else {
      tempProgram[name] = value;
    }
    localStorage.setItem("program", JSON.stringify(tempProgram));
    setProgram(tempProgram);
  };

  const handleAddSession = (setAccordionKey) => {
    setProgram((prevProgram) => {
      const updatedSessions = [
        ...prevProgram.sessions,
        {
          muscles: [],
          exercises: [],
          name: "",
          color: "",
        },
      ];
      setAccordionKey(new Set([updatedSessions.length.toString()]));
      return { ...prevProgram, sessions: updatedSessions };
    });
  };

  const handleRemoveSession = (index) => {
    setProgram((prevProgram) => {
      const updatedSessions = [...prevProgram.sessions];
      updatedSessions.splice(index, 1);
      return { ...prevProgram, sessions: updatedSessions };
    });
  };

  return (
    <ProgramContext.Provider
      value={{
        program,
        setProgram,
        handleOnChangeProgram,
        handleAddSession,
        handleRemoveSession,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export default ProgramContext;
