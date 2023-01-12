import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import Navbar from './Navbar/Navbar';
import Loading from '../../_view/Common/Loading/Loading';
import TopBar from './TopBar/TopBar';
import useAuth from '../../../hooks/useAuth';

export default function Layout() {
  const { isAuthenticationComplete } = useAuth();

  return (
    <div className={styles.wrapper}>
      <TopBar />
      <div className={styles.columnWrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.navbarWrapper}>
            <div className={styles.navbarWrapperInner}>
              <Navbar />
            </div>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.view}>
            {isAuthenticationComplete ? (
              <Outlet />
            ) : (
              <Loading message="Authenticating..." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
