import Link from "next/link";
import { useSession } from "next-auth-static-site";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Protected from "../components/Protected";

export default function Home() {
  const { status, data: session, token } = useSession();

  // Fetch some external data if authenticated
  const { data: users, error } = useSWR(
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

  if (status === "loading") {
    return null; // Display nothing or...

    // Display loading state
    return (
      <>
        <h1>Users</h1>
        <div>Loading...</div>
      </>
    );
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
    return (
      <>
        <h1>Users</h1>

        <div>
          <ul>
            {!error &&
              users &&
              users
                .filter((user) => {
                  return user.id;
                })
                .map((user) => {
                  return (
                    <li key={user.id}>
                      <Link href={`/user/${user.id}`}>{user.username}</Link>
                    </li>
                  );
                })}
          </ul>
        </div>
      </>
    );
  }
}
