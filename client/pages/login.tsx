import { useState } from "react";
import { useRouter } from "next/router";
import { useLogin } from "next-auth-static-site";
import styled from "@emotion/styled";

const Input = styled.input`
  margin: 0.5rem 0;
`;

const Button = styled.button`
  margin: 0.5rem 0;
`;

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

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          onChange={handleUsername}
          value={username}
          placeholder="Username"
        />
        <Input
          type="password"
          name="password"
          onChange={handlePassword}
          value={password}
          placeholder="Password"
        />
        <Button>Login</Button>
        <div>{status}</div>
      </form>
    </div>
  );
}
