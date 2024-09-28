import { useState, useEffect } from "react";

export default function useUser(userSession) {
  const [userId, setUserId] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getUser = async () => {
    try {
      const url = `${baseUrl}/api/users?email=${userSession?.user?.email}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const user = await response.json();
        setUserId(user._id);
      }
    } catch (error) {
      throw error;
    }
  };

  const addUser = async (body) => {
    try {
      const url = `${baseUrl}/api/users`;
      delete body.confirmedPassword;
      console.log("body", body);
      const response = await fetch(
        url,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const user = await response.json();
        console.log("user", user);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getUser();
  }, [userSession]);

  return {
    userId,
    addUser,
  };
}
