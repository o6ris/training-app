import { useState } from "react";
import { getSession, useSession, signIn, signOut } from "next-auth/react";

function Login() {
  const [credentials, setCredentials] = useState();
  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };
  const session = useSession();
  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email: credentials.email,
      password: credentials.password,
    });
    if (res.ok) {
      return res;
    } else {
      console.error(res.error);
    }
  };
  return (
    <div>
      <p>{session?.data?.user?.email}</p>
      <input
        onChange={(e) => handleOnChange("email", e.target.value)}
        style={{ color: "black" }}
        type="email"
      />
      <input
        onChange={(e) => handleOnChange("password", e.target.value)}
        style={{ color: "black" }}
        type="password"
      />
      <button type="button" onClick={() => handleLogin()}>
        Login
      </button>
      <button onClick={() => signIn("google")}> Sign In with Google</button>
      <div>
        {session?.status === "authenticated" ? (
          <>
            <p>Connected</p>
            <button type="button" onClick={() => signOut({ redirect: false })}>
              Logout
            </button>
          </>
        ) : (
          "Not connected"
        )}
      </div>
    </div>
  );
}

export default Login;
