import { useState, useEffect } from "react";

export default function useStats(userId) {
  const [stats, setStats] = useState([]);
  const [statsByDate, setStatsByDate] = useState([]);
  const [workoutsDates, setWorkoutsDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestStats, setLatestStats] = useState({});
  const [range, setRange] = useState("month");
  const [startDate, setStartDate] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getStats = async () => {
    try {
      setIsLoading(true);
      const url = `${baseUrl}/api/stats?user=${userId}&range=${range}`;

      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const stats = await response.json();
        setStats(stats);
        const latest = stats.reduce((acc, entry) => {
          const exerciseName = entry.exercise.name;
          if (
            !acc[exerciseName] ||
            new Date(entry.date) > new Date(acc[exerciseName].date)
          ) {
            acc[exerciseName] = entry;
          }
          return acc;
        }, {});
        setLatestStats(latest);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getStatById = async (id, exerciseName) => {
    try {
      const url = `${baseUrl}/api/stats/${id}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const stat = await response.json();
        setLatestStats({ ...latestStats, [exerciseName]: stat });
      }
    } catch (error) {
      throw error;
    }
  };

  const getStatsByDate = async (date) => {
    const formatedDate = new Date(date).toISOString().split("T")[0];

    try {
      const url = `${baseUrl}/api/stats/statsByDate?user=${userId}&date=${formatedDate}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const stats = await response.json();
        setStatsByDate(stats);
      }
    } catch (error) {
      throw error;
    }
  };

  const getStatsByMonth = async (month) => {
    try {
      setIsLoading(true)
      const url = `${baseUrl}/api/stats/statsByMonth?user=${userId}&month=${month}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const stats = await response.json();

      if (!stats) {
        console.error("No stats found");
        return;
      }

      const statsByDate = stats.map(
        (stat) => new Date(stat.date).toISOString().split("T")[0]
      );
      const uniqueStatsDate = [...new Set(statsByDate)];

      setStats(stats);
      setWorkoutsDates(uniqueStatsDate);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false)
    }
  };

  const renderStartDate = () => {
    const now = new Date();
    switch (range) {
      case "month":
        setStartDate(new Date(now.setDate(now.getDate() - 30)));
        break;
      case "trim":
        setStartDate(new Date(now.setMonth(now.getMonth() - 3)));
        break;
      case "sem":
        setStartDate(new Date(now.setMonth(now.getMonth() - 6)));
        break;
      case "year":
        setStartDate(new Date(now.setMonth(now.getMonth() - 12)));
        break;
      default:
        setStartDate(new Date(0));
    }
  };

  const firstDateOfMonth = (date = new Date()) =>
    new Date(date?.getFullYear(), date?.getMonth(), 1);

  useEffect(() => {
    renderStartDate();
  }, [range]);

  useEffect(() => {
    if (userId) {
      getStats();
    }
  }, [userId, range]);

  // TODO: optimize with spread operator
  const uniqueWorkoutDates = stats?.reduce((acc, entry) => {
    const workoutDate = entry.date;
    acc.add(workoutDate);
    return acc;
  }, new Set());

  const workoutDateslist = Array.from(uniqueWorkoutDates);

  // Group data by exercise name
  const statsByExercises = stats?.reduce((acc, entry) => {
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

  const sortedExerciseGroups = Object.entries(statsByExercises)
    .map(([exercise, entries]) => {
      // Find the most recent date in the entries
      const mostRecentDate = entries.reduce((latest, entry) => {
        const entryDate = new Date(entry.date);
        return entryDate > latest ? entryDate : latest;
      }, new Date(0)); // Initial date is set to the epoch

      return { exercise, mostRecentDate };
    })
    .sort((a, b) => b.mostRecentDate - a.mostRecentDate) // Sort by date in descending order
    .map(({ exercise }) => exercise); // Extract the exercise names in sorted order

  const orderedStatsByExercises = {};
  sortedExerciseGroups.forEach((exercise) => {
    orderedStatsByExercises[exercise] = statsByExercises[exercise];
  });

  return {
    stats: orderedStatsByExercises,
    allExerciseList: sortedExerciseGroups,
    workoutDateslist,
    latestStats,
    getStatById,
    getStatsByDate,
    statsByDate,
    getStatsByMonth,
    workoutsDates,
    firstDateOfMonth,
    range,
    setRange,
    startDate,
    isLoading,
  };
}
