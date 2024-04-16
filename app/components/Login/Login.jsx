import { useState } from "react";
import { getSession, useSession, signIn, signOut } from "next-auth/react";

function Login() {
  const [credentials, setCredentials] = useState();
  console.log(credentials);
  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };
  const session = useSession();
  console.log(session);
  const handleLogin = async () => {
    await signIn("credentials", {
      redirect: false,
      email: credentials.email,
      password: credentials.password,
    });
  };
  return (
    <div>
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
