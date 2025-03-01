import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import NotificationContext from "@modules/client/contexts/toastNotificationProvider";

export default function useWorkoutSession() {
  const [message, setMessage] = useState();
  const [workouts, setWorkouts] = useState();
  const { data: session } = useSession();
  const { handleNotification } = useContext(NotificationContext);
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
        handleNotification("Session saved", true);
        return data;
      } else {
        const error = new Error(data.message || "Something went wrong");
        error.status = data.status || response.status;
        if (data.message.includes("duplicate key")) {
          const match = data.message.match(/"([^"]+)"/);
          if (match) {
            handleNotification(
              `Name ${match[1]} already exist. Choose another one.`,
              false
            );
          } else {
            handleNotification(data.message || "Something went wrong", false);
          }
        }
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
