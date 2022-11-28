import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavbarSubItem.module.scss';

export default function NavbarSubItem(props) {
  const { path, label } = props;
  const location = useLocation();
  const isActive = path && new RegExp(`${path}(/|$)$`).test(location.pathname);

  return (
    <Link
      to={path}
      className={isActive ? styles.activeItem : ''}
      reloadDocument
    >
      <div className={styles.navbarSubItem}>
        <p className={styles.label}>{label}</p>
      </div>
    </Link>
  );
}
