import { useState, useEffect } from "react";

export default function useStats(userId) {
  const [stats, setStats] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const getStats = async () => {
    try {
      const url = `${baseUrl}/api/stats?user=${userId}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const stats = await response.json();
        setStats(stats);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getStats();
  }, [userId]);

  // Group data by exercise name
  const statsByExercises = stats.reduce((acc, entry) => {
    // Get the exercise name for the current entry
    const exerciseName = entry.exercise.name;
    // If the exercise name doesn't exist in the accumulator object, add it with an empty array
    if (!acc[exerciseName]) {
      acc[exerciseName] = [];
    }
    // Push the current entry into the array for the corresponding exercise name
    acc[exerciseName].push(entry);
    // Return the accumulator object for the next iteration
    return acc;
  }, {}); // Initialize the accumulator object as an empty object

  // Sort each group's data by date in descending order
  Object.keys(statsByExercises).forEach((exerciseName) => {
    statsByExercises[exerciseName].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  });

  return {
    stats: statsByExercises,
  };
}
