import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function useWorkoutSession() {
  const [message, setMessage] = useState();
  const [workouts, setWorkouts] = useState();
  const { data: session } = useSession();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getSessions = async () => {
    const url = `${baseUrl}/api/sessions?email=${session?.user.email}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (response.ok) {
        const workouts = await response.json();
        setMessage({ message: "Get session succed", status: response.status });
        setWorkouts(workouts);
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

  const saveSession = async (email, name, exercises) => {
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
        setMessage({ message: "Session saved!", status: response.status });
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

  const deleteSession = async (id) => {
    try {
      const url = `${baseUrl}/api/sessions/${id}`;
      const response = await fetch(url, {
        next: { revalidate: 1 },
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ message: "Session deleted!", status: response.status });
        setWorkouts((prevWorkouts) =>
          prevWorkouts.filter((workout) => workout._id !== id)
        );
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
    getSessions();
  }, [session]);

  return {
    saveSession,
    deleteSession,
    workouts,
    message,
  };
}
