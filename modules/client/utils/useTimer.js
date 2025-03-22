import { useState, useEffect, useRef } from "react";

// Custom hook to manage timers
const useTimer = (session) => {
  const [timers, setTimers] = useState([]); // State to store timers
  const intervalRefs = useRef([]); // Reference to store interval IDs

  const resetTimers = () => {
    setTimers((prevTimers) => {
      return session.map((exercise) => {
        return {
          seconds: exercise.restTime, // Always update to the latest restTime
          isRunning: false,
        };
      });
    });

    // Reset intervalRefs based on the new session structure
    intervalRefs.current = session.map((exercise) => null);
  };

  // Function to start a timer for a specific exercise and set index
  const startTimer = (exerciseIndex) => {
    // Prevent multiple intervals for the same timer
    if (intervalRefs.current[exerciseIndex]) return;

    intervalRefs.current[exerciseIndex] = setInterval(() => {
      setTimers((prevTimers) => {
        return prevTimers.map((timer, i) => {
          if (i === exerciseIndex) {
            if (timer.seconds > 0) {
              return { ...timer, seconds: timer.seconds - 1 };
            } else {
              clearInterval(intervalRefs.current[exerciseIndex]);
              intervalRefs.current[exerciseIndex] = null;
              return { ...timer, isRunning: false };
            }
          }
          return timer;
        });
      });
    }, 1000);

    setTimers((prevTimers) => {
      return prevTimers.map((timer, i) => {
        if (i === exerciseIndex) {
          return { ...timer, isRunning: true };
        }
        return timer;
      });
    });
  };

  // Function to format time in MM:SS format
  const getFormattedTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return {
    startTimer,
    getFormattedTime,
    timers,
    resetTimers,
  };
};

export default useTimer;
