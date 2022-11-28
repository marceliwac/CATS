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
      <div className={styles.leftColumn}>
        <Navbar />
      </div>
      <div className={styles.rightColumn}>
        <TopBar />
        <div className={styles.view}>
          {isAuthenticationComplete ? (
            <Outlet />
          ) : (
            <Loading message="Authenticating..." />
          )}
        </div>
      </div>
    </div>
  );
}
