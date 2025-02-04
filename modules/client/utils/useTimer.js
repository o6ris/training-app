import { useState, useEffect, useRef } from "react";

// Custom hook to manage timers
const useTimer = (session) => {
  const [timers, setTimers] = useState([]); // State to store timers
  const intervalRefs = useRef([]); // Reference to store interval IDs

  // console.log("timers", timers)

  const resetTimers = () => {
    setTimers(
      session.map((exercise) =>
        exercise.sets.map(() => ({
          seconds: exercise.restTime,
          isRunning: false,
        }))
      )
    );

    // Reset intervalRefs to null
    intervalRefs.current = session.map((exercise) =>
      exercise.sets.map(() => null)
    );
  };

  // Function to start a timer for a specific exercise and set index
  const startTimer = (exerciseIndex, setIndex) => {
    // Prevent multiple intervals for the same timer
    if (intervalRefs.current[exerciseIndex][setIndex]) return;

    // Set interval to update the timer every second
    intervalRefs.current[exerciseIndex][setIndex] = setInterval(() => {
      setTimers((prevTimers) => {
        // Create a new timers array with updated values
        const newTimers = prevTimers.map((exerciseTimers, i) =>
          exerciseTimers.map((timer, j) => {
            if (i === exerciseIndex && j === setIndex) {
              const updatedTimer = { ...timer };
              if (updatedTimer.seconds > 0) {
                updatedTimer.seconds -= 1; // Decrease the seconds
              } else {
                // Stop the timer when it reaches zero
                clearInterval(intervalRefs.current[exerciseIndex][setIndex]);
                intervalRefs.current[exerciseIndex][setIndex] = null;
                updatedTimer.isRunning = false;
              }
              return updatedTimer;
            }
            return timer; // Return unchanged timers
          })
        );
        return newTimers; // Update the state with new timers array
      });
    }, 1000);

    // Set the timer to running state
    setTimers((prevTimers) => {
      const newTimers = prevTimers.map((exerciseTimers, i) =>
        exerciseTimers.map((timer, j) => {
          if (i === exerciseIndex && j === setIndex) {
            return { ...timer, isRunning: true }; // Update the timer to running state
          }
          return timer; // Return unchanged timers
        })
      );
      return newTimers; // Update the state with new timers array
    });
  };

  // Function to format time in MM:SS format
  const getFormattedTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0"); // Get minutes and pad with zero if needed
    const secs = (seconds % 60).toString().padStart(2, "0"); // Get seconds and pad with zero if needed
    return `${mins}:${secs}`; // Return formatted time
  };

  return {
    startTimer, // Function to start a timer
    getFormattedTime, // Function to format time
    timers, // Current timers state
    resetTimers,
  };
};

export default useTimer;
