import React from 'react';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Profile from './Profile/Profile';
import styles from './TopBar.module.scss';

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.breadcrumbs}>
        <div className={styles.left} />
        <div className={styles.breadcrumbsInner}>
          <Breadcrumbs />
        </div>
        <div className={styles.right} />
      </div>
      <Profile />
    </div>
  );
}
