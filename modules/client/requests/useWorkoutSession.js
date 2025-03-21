import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import NotificationContext from "@modules/client/contexts/toastNotificationProvider";

export default function useWorkoutSession() {
  const [message, setMessage] = useState();
  const [workouts, setWorkouts] = useState();
  const [tempWorkouts, setTempWorkouts] = useState();
  const [oneWorkout, setOneWorkout] = useState();
  const { data: session } = useSession();
  const { handleNotification } = useContext(NotificationContext);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const changeOneWorkoutName = (value) => {
    setOneWorkout((prevOneWorkout) => ({
      ...prevOneWorkout,
      name: value,
    }));
  };

  const addWorkoutExercise = (exercise) => {
    setOneWorkout((prevOneWorkout) => ({
      ...prevOneWorkout,
      exercises: [...prevOneWorkout.exercises, exercise],
    }));
  };

  const deleteWorkoutExercise = (id) => {
    setOneWorkout((prevOneWorkout) => ({
      ...prevOneWorkout,
      exercises: prevOneWorkout.exercises.filter((el) => el._id !== id),
    }));
  };

  const getWorkoutSessions = async () => {
    const url = `${baseUrl}/api/sessions?email=${session?.user.email}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (response.ok) {
        const workouts = await response.json();
        setMessage({ message: "Get session succed", status: response.status });
        setWorkouts(workouts);
        setTempWorkouts(workouts);
      } else {
        const error = new Error(data.message || "Something went wrong");
        error.status = data.status || response.status;
        throw error;
      }
    } catch (error) {
      setMessage(error);
      throw error;
    }
  };

  const getOneWorkoutSession = async (id) => {
    const url = `${baseUrl}/api/sessions/${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (response.ok) {
        const workout = await response.json();
        setMessage({ message: "Get session succed", status: response.status });
        setOneWorkout(workout);
        // setTempWorkouts(workouts);
      } else {
        const error = new Error(data.message || "Something went wrong");
        error.status = data.status || response.status;
        throw error;
      }
    } catch (error) {
      setMessage(error);
      throw error;
    }
  };

  const saveWorkoutSession = async (email, name, exercises) => {
    try {
      const url = `${baseUrl}/api/sessions`;
      const response = await fetch(
        url,
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            name: name,
            exercises: exercises,
          }),
        },
        { next: { revalidate: 1000 } }
      );
      const data = await response.json();
      if (response.ok) {
        handleNotification("Session saved", true);
        router.push("/workouts");
        return data;
      } else {
        const error = new Error(data.message);
        error.status = data.status || response.status;
        handleNotification(data.message || "Something went wrong", false);
        throw error;
      }
    } catch (error) {
      setMessage(error);
      throw error;
    }
  };

  const deleteWorkoutSession = async (id) => {
    try {
      const url = `${baseUrl}/api/sessions/${id}`;
      const response = await fetch(url, {
        next: { revalidate: 1 },
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ message: "Session deleted!", status: response.status });
        setWorkouts((prevWorkouts) => {
          const updatedWorkouts = prevWorkouts.filter(
            (workout) => workout._id !== id
          );
          setTempWorkouts(updatedWorkouts);
          return updatedWorkouts;
        });
        return data;
      } else {
        const error = new Error(data.message || "Something went wrong");
        error.status = data.status || response.status;
        throw error;
      }
    } catch (error) {
      setMessage(error);
      throw error;
    }
  };

  const updateWorkoutSession = async (id, body) => {
    try {
      const url = `${baseUrl}/api/sessions/${id}`;
      const response = await fetch(url, {
        next: { revalidate: 1 },
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        handleNotification("Session updated", true);
        setWorkouts((prevWorkouts) => {
          const updatedWorkouts = prevWorkouts.map((workout) =>
            workout._id === id ? { ...workout, ...body } : workout
          );
          setTempWorkouts(updatedWorkouts);
          router.push("/workouts");
          return updatedWorkouts;
        });
        return data;
      } else {
        const error = new Error(data.message || "Something went wrong");
        error.status = data.status || response.status;
        throw error;
      }
    } catch (error) {
      setMessage(error);
      throw error;
    }
  };

  useEffect(() => {
    getWorkoutSessions();
  }, [session]);

  return {
    getOneWorkoutSession,
    saveWorkoutSession,
    deleteWorkoutSession,
    updateWorkoutSession,
    changeOneWorkoutName,
    setWorkouts,
    addWorkoutExercise,
    deleteWorkoutExercise,
    workouts,
    tempWorkouts,
    oneWorkout,
    message,
  };
}
