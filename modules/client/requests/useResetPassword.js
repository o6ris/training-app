import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useRequestReset() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [message, setMessage] = useState();
  const router = useRouter();

  const getNewPassword = async (email) => {
    try
    {
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
      if (response.ok)
      {
        console.log("response", response)
        setMessage({ message: "Request sent, check your email (or Spam)!", status: response.status });
        return data;
      } else
      {
        const error = new Error(data.message || "Something went wrong");
        error.status = data.status || response.status;
        throw error;
      }
    } catch (error)
    {
      setMessage(error);
      throw error;
    }
  };

  const createNewPassword = async (token, password) => {
    try
    {
      const url = `${baseUrl}/api/auth/reset-password`;
      const response = await fetch(
        url,
        {
          method: "PATCH",
          body: JSON.stringify({
            token: token,
            password: password
          }),
        },
        { next: { revalidate: 10 } }
      );
      const data = await response.json();
      if (response.ok)
      {
        setMessage({ message: "Password updated", status: response.status });
        router.push("/login")
        return data;
      } else
      {
        const error = new Error(data.message || "Something went wrong");
        error.status = data.status || response.status;
        throw error;
      }
    } catch (error)
    {
      setMessage(error);
      throw error;
    }
  }

  return {
    getNewPassword,
    createNewPassword,
    message,
  };
}
