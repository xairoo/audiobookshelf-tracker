import Link from "next/link";
import { useSession, loginUrl } from "next-auth-static-site";

export default function AuthInfo() {
  const { status, data: session } = useSession();

  if (status === "unauthenticated") {
    return (
      <div>
        Not signed in,{" "}
        <Link href={loginUrl({ pathname: "/login" })}>login</Link>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div>
        <Link href="/logout">Logout</Link>
      </div>
    );
  }

  return null;
}
