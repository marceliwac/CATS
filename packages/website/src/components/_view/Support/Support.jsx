import React from 'react';
import styles from './Support.module.scss';
import logo from '../../../assets/images/wls_logo_banner.svg';

const supportEmail = 'support@wls.app';

export default function Support() {
  return (
    <div className={styles.support}>
      <img src={logo} alt="Logo" />
      <h1>Support Contact</h1>
      <p>
        For all types of support requests please contact Support at:{' '}
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
      </p>
    </div>
  );
}
