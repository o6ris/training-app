import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function useUser() {
  const { data: userSession } = useSession();
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

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
        delete user.password;
        setUser(user);
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
        if (response.ok) {
          router.push("/login");
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const editUser = async (id, body, setIsEditable) => {
    try {
      if (body.confirmedPassword) {
        delete body.confirmedPassword;
      }

      const url = `${baseUrl}/api/users/${id}`;
      const response = await fetch(
        url,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
        { next: { revalidate: 10 } }
      );
      if (response) {
        if (response.ok) {
          setIsEditable && setIsEditable(false);
        }
        const user = await response.json();
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
    user,
    addUser,
    editUser,
  };
}
