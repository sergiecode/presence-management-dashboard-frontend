"use client";

import { NextPage } from "next";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { MdNotifications, MdOutlineChat, MdPublic } from "react-icons/md";

const Navbar: NextPage = () => {
  const pathname = usePathname();
  return (
    <div className={styles.container}>
      <div className={styles.title}>{pathname.split("/").pop()}</div>
      <div className={styles.menu}>
        {/* <div className={styles.search}>
          <MdSearch />
          <input type="text" placeholder="Buscar..." className={styles.input} />
        </div> */}
        <div className={styles.icons}>
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <MdPublic size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
