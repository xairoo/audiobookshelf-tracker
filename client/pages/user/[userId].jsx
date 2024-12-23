import { useSession } from "next-auth-static-site";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";
import fetcher from "../../utils/fetcher";
import Protected from "../../components/protected";
import styles from "./../login.module.css";
import styled from "@emotion/styled";

const ProgressWrapper = styled.div`
  width: 150px;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0.5rem;
  color: #fff;
  background: #b366f9;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  text-align: right;
  display: flex;
  position: relative;
  /* justify-content: right; */
`;

const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${(props) => (props.progress ? props.progress : `0`)}%;
  height: 100%;
  background: #7627c0;
`;

const ProgressValue = styled.div`
  position: absolute;
  right: 0.25rem;
  top: 0;
  bottom: 0;
`;

const Progress = ({ progress }) => {
  return (
    <ProgressWrapper>
      <ProgressBar progress={progress} />
      <ProgressValue>{progress}%</ProgressValue>
    </ProgressWrapper>
  );
};

export default function Home() {
  const { status, data: session, token } = useSession();
  const router = useRouter();
  const { userId } = router.query;
  const [search, setSearch] = useState("");
  const [searchStr, setSearchStr] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setSearchStr(event.target.value.toLowerCase());
  };

  const { data: user, error: errorUser } = useSWR(
    token && status === "authenticated" && userId
      ? {
          url: `/api/v1/user/${userId}`,
          method: "GET",
          token,
        }
      : null, // Fetch only if bearer token is set
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const { data: history, error: errorHistory } = useSWR(
    token && status === "authenticated" && userId
      ? {
          url: `/api/v1/user/${userId}/history`,
          method: "GET",
          token,
        }
      : null, // Fetch only if bearer token is set
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 1000 * 10,
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
        <h1>History</h1>
        <Protected />
      </>
    );
  }

  if (status === "authenticated") {
    return (
      <>
        <h1>History</h1>

        <div>
          <ul>User: {!errorUser && user && user.username}</ul>
        </div>

        <div>
          <label className={styles.label}>
            <div className={styles.name}>Search:</div>
            <input
              className={styles.input}
              type="text"
              name="username"
              onChange={handleSearch}
              value={search}
            />
          </label>
        </div>

        <div>
          <ul>
            {!errorHistory &&
              history &&
              history
                .filter((item) => {
                  if (searchStr) {
                    return (
                      item.author?.toLowerCase().includes(searchStr) ||
                      item.podcastTitle?.toLowerCase().includes(searchStr) ||
                      item.title?.toLowerCase().includes(searchStr) ||
                      item.subtitle?.toLowerCase().includes(searchStr)
                    );
                  } else {
                    return item.progress > 0;
                  }
                  // return item.progress === 1;
                })
                .map((item) => {
                  return (
                    <li key={`${item.itemId}-${item.episodeId}`}>
                      {item.author || item.podcastTitle} - {item.title}{" "}
                      {item.subtitle && `- ${item.subtitle}`}
                      <Progress
                        progress={parseFloat((item.progress * 100).toFixed(2))}
                      />
                    </li>
                  );
                })}
          </ul>
        </div>
      </>
    );
  }
}
