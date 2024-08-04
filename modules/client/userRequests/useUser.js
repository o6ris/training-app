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

  useEffect(() => {
    getUser();
  }, [userSession]);

  return {
    userId,
  };
}
