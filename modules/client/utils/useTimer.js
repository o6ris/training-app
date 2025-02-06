import { useState, useEffect, useRef } from "react";

// Custom hook to manage timers
const useTimer = (session) => {
  const [timers, setTimers] = useState([]); // State to store timers
  const intervalRefs = useRef([]); // Reference to store interval IDs


  const resetTimers = () => {
    setTimers((prevTimers) => {
      // If timers are empty, initialize them from session
      if (prevTimers.length === 0) {
        return session.map((exercise) =>
          exercise.sets.map(() => ({
            seconds: exercise.restTime,
            isRunning: false,
          }))
        );
      }
      // Otherwise, update only the seconds and isRunning state
      const timers = prevTimers.map((exerciseTimers, exerciseIndex) =>
        exerciseTimers.map((timer, setIndex) => {
          const newRestTime = session[exerciseIndex].restTime; // Get the new session rest time
          const updatedSeconds =
          timer.seconds !== newRestTime
            ? newRestTime // Use new value if it changed
            : timer.seconds; // Otherwise, keep current value

          return {
            ...timer,
            seconds: updatedSeconds, // Reset time based on session
            isRunning: false, // Stop the timer
          };
        })
      );
      return timers
    });
    // Reset intervalRefs only if they are empty
    if (intervalRefs.current.length === 0) {
      intervalRefs.current = session.map((exercise) =>
        exercise.sets.map(() => null)
      );
    }
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
