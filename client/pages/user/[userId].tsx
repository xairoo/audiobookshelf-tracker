import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth-static-site";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Protected from "../../components/Protected";
import AddItem from "../../components/AddItem";
import Dialog from "../../components/Dialog";
import { CaretDown, MagnifyingGlass } from "../../components/Icons";
import {
  Listbox as HUDListbox,
  ListboxButton as HUDListboxButton,
  ListboxOption as HUDListboxOption,
  ListboxOptions as HUDListboxOptions,
} from "@headlessui/react";
import { User } from "../../lib/types";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ListboxButton = styled(HUDListboxButton)`
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 0.25rem 0.5rem;
  width: 200px;
  text-align: left;
`;

const CaretDownIcon = styled(CaretDown)`
  align-self: center;
`;

const ListboxOptions = styled(HUDListboxOptions)`
  margin-top: 0.25rem;
  padding: 0.25rem;
  width: 200px;
  border: 2px solid var(--input-border-color);
  background: var(--input-background);
  border-radius: 0.5rem;
`;

const ListboxOption = styled(HUDListboxOption)`
  padding: 0.25rem 2rem;
  border-radius: 0.25rem;
  text-align: center;
  background-color: transparent;
  transition: all ease-in-out 0.1s;

  cursor: default;
  :hover {
    background-color: var(--input-background-focus);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  align-items: center;
  display: flex;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
`;

const History = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Entry = styled.div`
  background: #23063d;
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

interface ProgressBar {
  readonly progress?: number;
}

const ProgressBar = styled.div<ProgressBar>`
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

export default function Page() {
  const { status, token } = useSession();
  const router = useRouter();
  const { userId } = router.query;
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [searchStr, setSearchStr] = useState("");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>();

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setSearchStr(event.target.value.toLowerCase());
  };

  const { data: users } = useSWR<User[] | null>(
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

  const { data: user } = useSWR<User | null>(
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

  const { data: historyData, error: errorHistory } = useSWR<History[] | null>(
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

  useEffect(() => {
    if (historyData) {
      setHistory(historyData);
    }
  }, [historyData]);

  useEffect(() => {
    setSelectedUser(user);
  }, [user, userId]);

  if (status === "loading") {
    return null; // Display nothing or...
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

        <Content>
          <UserWrapper>
            <div>User:</div>
            {users && selectedUser && (
              <HUDListbox
                value={selectedUser}
                onChange={(user) => {
                  setSelectedUser(user);
                  router.push(`/user/${user.id}`);
                }}
              >
                <ListboxButton>
                  {selectedUser.username} <CaretDownIcon color="#fff" />
                </ListboxButton>
                <ListboxOptions anchor={{ to: "bottom start", gap: "4px" }}>
                  {users?.map((user) => {
                    return (
                      <ListboxOption key={user.id} value={user}>
                        {user.username}
                      </ListboxOption>
                    );
                  })}
                </ListboxOptions>
              </HUDListbox>
            )}
          </UserWrapper>

          <div>
            <button onClick={() => setShowAddItemDialog(true)}>Add Item</button>
          </div>

          <Dialog
            visible={showAddItemDialog}
            onClose={() => {
              setShowAddItemDialog(false);
            }}
            title="Custom Item"
          >
            <AddItem
              onHistoryUpdate={(history) => {
                setHistory(history);
              }}
            />
          </Dialog>

          <SearchWrapper>
            <input
              onChange={handleSearch}
              value={search}
              placeholder="Filter by author and title"
            />
            <SearchIconWrapper>
              <MagnifyingGlass width="60%" color="#fff" />
            </SearchIconWrapper>
          </SearchWrapper>

          <History>
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
                })
                .map((item) => {
                  const array = [
                    item.author,
                    item.podcastTitle,
                    item.title,
                    item.subtitle,
                  ];

                  return (
                    <Entry key={`${item.itemId}-${item.episodeId}`}>
                      <Meta>
                        <Title>
                          {array
                            .filter((item) => item != null && item !== "")
                            .join(" - ")}
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
          </History>
        </Content>
      </>
    );
  }
}
