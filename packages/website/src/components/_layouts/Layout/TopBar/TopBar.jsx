import React from 'react';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Profile from './Profile/Profile';
import styles from './TopBar.module.scss';
import logo from '../../../../assets/images/wls_logo_banner.svg';

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={styles.breadcrumbs}>
        <div className={styles.left} />
        <div className={styles.breadcrumbsInner}>
          <Breadcrumbs />
        </div>
        <div className={styles.right} />
      </div>
      <div className={styles.profile}>
        <Profile />
      </div>
    </div>
  );
}
