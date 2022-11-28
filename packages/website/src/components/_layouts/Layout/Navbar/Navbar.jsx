import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import styles from './Navbar.module.scss';
import AuthenticationContext from '../../../../contexts/AuthenticationContext';
import NavbarItem from './NavbarItem/NavbarItem';
import NavbarSubItem from './NavbarSubItem/NavbarSubItem';
import NavbarHeader from './NavbarHeader/NavbarHeader';

export default function Navbar() {
  const { isParticipant, isAdministrator } = React.useContext(
    AuthenticationContext
  );

  return (
    <div className={styles.navbar}>
      <NavbarHeader />
      {isAdministrator && (
        <>
          <NavbarItem
            path="/administrator/users"
            icon={<PeopleIcon />}
            label="Users"
          >
            <NavbarSubItem
              path="/administrator/users/administrators"
              label="Administrators"
            />
            <NavbarSubItem
              path="/administrator/users/participants"
              label="Participants"
            />
          </NavbarItem>
        </>
      )}
      {isParticipant && (
        <>
          <NavbarItem
            path="/participant/stays"
            icon={<SchoolIcon />}
            label="Stays"
          >
            <NavbarSubItem path="/participant/stays" label="Assigned to me" />
          </NavbarItem>
        </>
      )}
    </div>
  );
}
