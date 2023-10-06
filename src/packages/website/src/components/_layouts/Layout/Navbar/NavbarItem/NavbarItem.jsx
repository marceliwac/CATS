import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavbarItem.module.scss';

export default function NavbarItem(props) {
  const { path, label, icon, children } = props;
  const location = useLocation();
  const isActive = path && new RegExp(`${path}(/|$)`).test(location.pathname);

  return (
    <div className={styles.navbarItem}>
      <Link
        to={path}
        className={`${styles.link} ${isActive ? styles.activeItem : ''}`}
        reloadDocument
      >
        <div className={styles.icon}>{icon}</div>
        <p className={styles.label}>{label}</p>
      </Link>
      {isActive && <div className={styles.subItems}>{children}</div>}
    </div>
  );
}
