import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth-static-site";
import Link from "next/link";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Protected from "../components/Protected";

export default function Home() {
  const { status, token } = useSession();
  const router = useRouter();

  // Fetch some external data if authenticated
  const { data: users } = useSWR(
    token && status === "authenticated"
      ? {
          url: `/api/v1/users`,
          method: "GET",
          token,
        }
      : null, // Fetch only if bearer token is set
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // Route to the first user
  useEffect(() => {
    if (status === "authenticated" && users && users[0] && users[0].id) {
      router.push(`/user/${users[0].id}`);
    }
  }, [status, users]);

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <h1>Audiobookshelf Tracker</h1>
        <Protected />
      </>
    );
  }

  if (status === "authenticated") {
    return null;
  }
}
