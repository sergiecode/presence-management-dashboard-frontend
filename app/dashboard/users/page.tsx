import { NextPage } from "next";
import styles from "./user.module.css";

const Page: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glass}></div>
    </div>
  );
};

export default Page;
