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
          <NavbarItem
            path="/administrator/stayAssignments"
            icon={<PeopleIcon />}
            label="Stay assignments"
          >
            <NavbarSubItem
              path="/administrator/stayAssignments"
              label="All stay assignments"
            />
          </NavbarItem>
          <NavbarItem
            path="/administrator/groupAssignments"
            icon={<PeopleIcon />}
            label="Group assignments"
          >
            <NavbarSubItem
              path="/administrator/groupAssignments"
              label="All group assignments"
            />
          </NavbarItem>
        </>
      )}
      {isParticipant && (
        <>
          <NavbarItem
            path="/participant/stayAssignments"
            icon={<SchoolIcon />}
            label="Stay assignments"
          >
            <NavbarSubItem
              path="/participant/stayAssignments"
              label="Assigned to me"
            />
          </NavbarItem>
        </>
      )}
    </div>
  );
}
