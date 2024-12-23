import Link from "next/link";
import AuthInfo from "./authInfo";
import styles from "./index.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.flex}>
        <div>
          <Link href="/">Home</Link>
        </div>
      </div>
      <AuthInfo />
    </div>
  );
}
