import { useSession } from "next-auth-static-site";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useState } from "react";
import fetcher from "../../utils/fetcher";
import Protected from "../../components/protected";
import styled from "@emotion/styled";

const UserWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const Select = styled.select`
  appearance: none;
  width: 200px;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  background-color: #380568;
  border: 2px solid #380568;
  border-radius: 0.5rem;
  box-shadow: none;
  color: #fff;
  cursor: pointer;
  :focus {
    outline: none;
    outline-offset: 0;
    border: 2px solid #380568;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  margin: 1rem 0;
`;

const Search = styled.input`
  height: 20px;
  width: 100%;
  background: transparent;
  border: 2px solid #37095f;
  border-radius: 0.25rem;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  box-shadow: none;
  color: #fff;
  ::placeholder {
    color: #8a8a8a;
  }
  :focus {
    outline: none;
    outline-offset: 0;
    border: 2px solid #7627c0;
  }
`;

const SearchIconWrapper = styled.div`
  background: #380568;
  position: absolute;
  right: 0.25rem;
  top: 0.25rem;
  bottom: 0.25rem;
  display: flex;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
`;

const SearchIcon = styled.svg`
  height: 1rem;
  width: 1rem;
`;

const Entry = styled.div`
  background: #23063d;
  margin: 0.75rem 0;
  padding: 0.25rem 0.5rem;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Meta = styled.div`
  margin: 0.25rem 0.5rem;
  right: 0.25rem;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 2rem;
`;

const Title = styled.div`
  z-index: 5;
`;

const ProgressValue = styled.div`
  z-index: 5;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: ${(props) => (props.progress ? props.progress : `0`)}%;
  height: 100%;
  background: #7627c0;
  border-radius: 0.5rem;
`;

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

  const { data: users, error: errorUsers } = useSWR(
    token && status === "authenticated" && userId
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

        <UserWrapper>
          <div>User:</div>
          <Select
            value={user?.id}
            onChange={(e) => router.push(`/user/${e.target.value}`)}
          >
            {users?.map((user) => {
              return (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              );
            })}
          </Select>
        </UserWrapper>

        <SearchWrapper>
          <Search
            onChange={handleSearch}
            value={search}
            placeholder="Author, Title, ..."
          />
          <SearchIconWrapper>
            <SearchIcon
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" />
            </SearchIcon>
          </SearchIconWrapper>
        </SearchWrapper>
        <div>
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
                  <Entry key={`${item.itemId}-${item.episodeId}`}>
                    <Meta>
                      <Title>
                        {item.author || item.podcastTitle} - {item.title}{" "}
                        {item.subtitle && `- ${item.subtitle}`}
                      </Title>
                      <ProgressValue>
                        {parseFloat((item.progress * 100).toFixed(0))}%
                      </ProgressValue>
                    </Meta>
                    <ProgressBar
                      progress={parseFloat((item.progress * 100).toFixed(2))}
                    />
                  </Entry>
                );
              })}
        </div>
      </>
    );
  }
}
