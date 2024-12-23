import Link from "next/link";
import styles from "./index.module.css";
import { loginUrl } from "next-auth-static-site";

export default function Protected() {
  return (
    <div className={styles.warning}>
      <div className="">
        Please <Link href={loginUrl({ pathname: "/login" })}>login</Link> to
        view this page.
      </div>
    </div>
  );
}
