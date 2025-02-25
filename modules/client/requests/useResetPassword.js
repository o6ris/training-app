import { useState } from "react";

export default function useRequestReset(email) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [message, setMessage] = useState("");
  console.log("message", message, typeof message)

  const getNewPassword = async (email) => {
    try {
      const url = `${baseUrl}/api/auth/request-reset`;
      const response = await fetch(
        url,
        {
          method: "POST",
          body: JSON.stringify(email),
        },
        { next: { revalidate: 10 } }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage("message sent!");
        return data;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      setMessage(error.message);
      throw error;
    }
  };

  return {
    getNewPassword,
    message,
  };
}
