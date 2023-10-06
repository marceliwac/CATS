import React from 'react';
import logo from '../../../../../assets/images/wls_logo_banner.svg';
import styles from './NavbarHeader.module.scss';
import useAuth from '../../../../../hooks/useAuth';

export default function NavbarHeader() {
  const { credentials, isAdministrator, isResearcher } = useAuth();
  const roles = [];
  if (credentials) {
    if (isAdministrator) {
      roles.push('Administrator');
    }
    if (isResearcher) {
      roles.push('Participant');
    }
  }

  const role = roles.join(', ');

  return (
    <div className={styles.navbarHeader}>
      <img src={logo} alt="Logo" />

      {role && role !== 'Participant' && (
        <div className={styles.row}>
          <p className={styles.header}>Role{roles.length > 1 ? 's' : ''}:</p>
          <p className={styles.value}>{role}</p>
        </div>
      )}
    </div>
  );
}
