import { useSession } from "next-auth-static-site";
import { useRouter } from "next/router";
import { useState } from "react";
import styled from "@emotion/styled";
import { Switch as HUDSwitch } from "@headlessui/react";
import { History } from "../../lib/types";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Flex = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: end;
  align-items: center;
`;

const Input = styled.input`
  margin: 0;
`;

const Button = styled.button`
  margin: 0;
`;

const Switch = styled(HUDSwitch)`
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 1rem;
  height: 2rem;
  width: 3.5rem;
  display: flex;
  align-content: center;
  justify-content: start;
  border-color: var(--input-border-color);

  > span {
    transition: all ease-in-out 0.125s;
    translate: 0 0;
  }

  &[data-checked] {
    > span {
      translate: 1.5rem 0;
      background-color: var(--input-border-color-focus);
    }
  }
`;

const SwitchIcon = styled.span`
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 100%;
  background-color: var(--input-border-color);
`;

export default function AddItem({
  onHistoryUpdate,
}: {
  onHistoryUpdate: (body: History[]) => void;
}) {
  const { status, token } = useSession();
  const router = useRouter();
  const { userId } = router.query;
  const [error, setError] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isFinished, setIsFinished] = useState(true);

  const handleAuthor = (e) => {
    setAuthor(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  async function handleSubmit() {
    try {
      const res = await fetch(`/api/v1/user/${userId}/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ author, title, isFinished }),
      });
      const body = await res.json();
      if (res.ok) {
        setError("");

        // Reset the fields
        setAuthor("");
        setTitle("");
        setIsFinished(true);

        // Return the new history to the parent component
        if (typeof onHistoryUpdate === "function") {
          onHistoryUpdate(body);
        }
      } else {
        setError(body.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (status !== "authenticated") {
    return;
  }

  return (
    <FlexColumn>
      <Input
        type="text"
        name="title"
        onChange={handleTitle}
        value={title}
        placeholder="Title"
      />
      <Input
        type="text"
        name="author"
        onChange={handleAuthor}
        value={author}
        placeholder="Author"
      />

      <Flex>
        Is finished?{" "}
        <Switch checked={isFinished} onChange={setIsFinished}>
          <SwitchIcon />
        </Switch>
      </Flex>

      <Button onClick={handleSubmit}>Save</Button>

      {error && error}
    </FlexColumn>
  );
}
