import { NextPage } from 'next'
import styles from "./user.module.css";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  return <div className={styles.container}>
    <div className={styles.glass}></div>
  </div>
}

export default Page