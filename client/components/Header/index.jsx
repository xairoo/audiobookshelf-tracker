import Link from "next/link";
import AuthInfo from "./AuthInfo";
import styled from "@emotion/styled";

const Content = styled.div`
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Navigation = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  white-space: nowrap;
`;

export default function Header() {
  return (
    <Content>
      <Navigation>
        <Link href="/">Home</Link>
      </Navigation>
      <AuthInfo />
    </Content>
  );
}
