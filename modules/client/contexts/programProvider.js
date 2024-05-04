import { createContext, useState } from "react";

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [program, setProgram] = useState({
    sessions: [
      {
        muscles: [],
        exercises: [],
        name: "",
        color: "",
      },
    ],
  });

  const handleOnChangeProgram = (name, value, index, section) => {
    const tempProgram = {...program};
    if (section && section === "sessions") {
      const updatedSessions = [...tempProgram.sessions];
      const updatedSession = { ...updatedSessions[index], [name]: value };
      updatedSessions[index] = updatedSession;
      tempProgram[section] = updatedSessions
    } else {
      tempProgram[name] = value
    }
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
