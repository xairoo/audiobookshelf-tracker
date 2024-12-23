import { useState } from "react";
import { useRouter } from "next/router";
import { useLogin } from "next-auth-static-site";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const login = useLogin();

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("Loading...");

    const response = await login({
      body: {
        username: username,
        password: password,
      },
      callbackUrl: router.query?.callbackUrl?.toString(),
      // callbackUrl: false,
    });

    if (response.error) {
      console.log(response.error);
      setStatus(response.error);
      // Handle the error...
      // setError(response.error);
      return;
    }

    if (response.callbackUrl) {
      router.push(response.callbackUrl);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>
            <div className={styles.name}>Username:</div>
            <input
              className={styles.input}
              type="text"
              name="username"
              onChange={handleUsername}
              value={username}
            />
          </label>
        </div>
        <div>
          <label className={styles.label}>
            <div className={styles.name}>Password:</div>
            <input
              className={styles.input}
              type="password"
              name="password"
              onChange={handlePassword}
              value={password}
            />
          </label>
        </div>
        <input type="submit" value="Submit" />
        <div>{status}</div>
      </form>
    </div>
  );
}
