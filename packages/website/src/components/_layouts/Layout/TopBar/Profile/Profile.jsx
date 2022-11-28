import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
// import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import styles from './Profile.module.scss';
import useAuth from '../../../../../hooks/useAuth';

export default function Profile() {
  const { currentUser } = useAuth();
  let displayedName = 'My profile';
  if (
    currentUser &&
    currentUser.attributes &&
    currentUser.attributes.given_name &&
    currentUser.attributes.family_name
  ) {
    displayedName = `${currentUser.attributes.given_name[0]}. ${currentUser.attributes.family_name}`;
  }

  return (
    <div className={styles.profile}>
      {(currentUser && (
        <>
          {/* <Link className={styles.link} to="/account/profile" reloadDocument> */}
          <div className={styles.link}>
            <div className={styles.icon}>
              <AccountCircleIcon />
            </div>
            <p>{displayedName}</p>
          </div>
          {/* <Link className={styles.link} to="/account/settings" reloadDocument> */}
          {/* <div className={styles.link}> */}
          {/*  <div className={styles.icon}> */}
          {/*    <Tooltip title="Settings"> */}
          {/*      <SettingsIcon /> */}
          {/*    </Tooltip> */}
          {/*  </div> */}
          {/* </div> */}
          <Link className={styles.link} to="/account/signOut" reloadDocument>
            <div className={styles.icon}>
              <Tooltip title="Sign out">
                <LogoutIcon />
              </Tooltip>
            </div>
          </Link>
        </>
      )) || (
        <>
          <Link className={styles.link} to="/account/signIn" reloadDocument>
            <div className={styles.icon}>
              <LoginIcon />
            </div>
            <p>Sign In</p>
          </Link>
        </>
      )}
    </div>
  );
}
