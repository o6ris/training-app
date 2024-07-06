import { useState, useEffect, useRef } from "react";

const useStopwatch = (autoStart = false, length) => {
  console.log("length", length);

  // State to track running status of each stopwatch
  const [isRunning, setIsRunning] = useState(Array(length).fill(autoStart));

  // State to track time of each stopwatch
  const [time, setTime] = useState([]);

  // Ref to store interval IDs for each stopwatch
  const intervalRef = useRef([]);

  // Initialize the time state array when the length changes
  useEffect(() => {
    setTime(Array(length).fill(0));
  }, [length]);

  // Effect to handle starting and stopping of intervals based on running status
  useEffect(() => {
    isRunning.forEach((running, index) => {
      if (running) {
        // If the stopwatch is running, set an interval to update the time every second
        intervalRef.current[index] = setInterval(() => {
          setTime((prevTime) => {
            const newTime = [...prevTime];
            newTime[index] += 1; // Increment the time for the specific stopwatch
            return newTime;
          });
        }, 1000);
      } else if (!running && intervalRef.current[index]) {
        // If the stopwatch is paused, clear the interval
        clearInterval(intervalRef.current[index]);
      }
    });

    // Cleanup intervals on component unmount
    return () => {
      intervalRef.current.forEach(clearInterval);
    };
  }, [isRunning, time]);

  // Function to start a specific stopwatch
  const start = (index) =>
    setIsRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = true;
      return newRunning;
    });

  // Function to pause a specific stopwatch
  const pause = (index) =>
    setIsRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = false;
      return newRunning;
    });

  // Function to reset a specific stopwatch
  const reset = (index) => {
    setIsRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = false;
      return newRunning;
    });
    setTime((prev) => {
      const newTime = [...prev];
      newTime[index] = 0;
      return newTime;
    });
  };

  // Function to get the minutes for a specific stopwatch
  const getMinutes = (index) => Math.floor(time[index] / 60);

  // Function to get the seconds for a specific stopwatch
  const getSeconds = (index) => time[index] % 60;

  console.log("time", time);

  // Return stopwatch controls and status
  return { getMinutes, getSeconds, isRunning, start, pause, reset };
};

export default useStopwatch;
