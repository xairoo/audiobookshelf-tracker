import Link from "next/link";
import styled from "@emotion/styled";
import { loginUrl } from "next-auth-static-site";

const Content = styled.div`
  background: #272114;
  border: 1px solid #6b4c0d;
  border-radius: 0.5em;
  padding: 1em;
`;

export default function Protected() {
  return (
    <Content>
      Please <Link href={loginUrl({ pathname: "/login" })}>login</Link> to view
      this page.
    </Content>
  );
}
