import React, { PropsWithChildren, useState } from "react";
import { Navbar } from "../navbar/navbar";
import { SideBar } from "../sidebar/sidebar";
import styles from "./page-template.module.scss";

export const PageTemplate: React.FC<PropsWithChildren> = ({ children }) => {
  const [sideMenuOpen, ] = useState<boolean>(true);

  return (
    <>
      <Navbar></Navbar>
      <div className={styles.container}>
        {sideMenuOpen && <SideBar />}
        <div className={styles.page}>
          <div className={styles.appBar}></div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </>
  );
};
