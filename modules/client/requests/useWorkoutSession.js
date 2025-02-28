import { useState } from "react";

export default function useWorkoutSession() {
  const [message, setMessage] = useState();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const saveSession = async (email, name, exercises) => {
    try {
      const url = `${baseUrl}/api/sessions`;
      console.log("url", url);
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
      const response = await fetch(
        url,
        {
          method: "DELETE",
          next: { revalidate: 1000 } 
        },
      );
      const data = await response.json();
      if (response.ok) {
        setMessage({ message: "Session deleted!", status: response.status });
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

  return {
    saveSession,
    deleteSession,
    message,
  };
}
