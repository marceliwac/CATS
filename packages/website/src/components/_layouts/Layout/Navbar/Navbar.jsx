import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import Filter1Icon from '@mui/icons-material/Filter1';
import HelpIcon from '@mui/icons-material/Help';
import styles from './Navbar.module.scss';
import AuthenticationContext from '../../../../contexts/AuthenticationContext';
import NavbarItem from './NavbarItem/NavbarItem';
import NavbarSubItem from './NavbarSubItem/NavbarSubItem';

export default function Navbar() {
  const { isParticipant, isAdministrator } = React.useContext(
    AuthenticationContext
  );

  return (
    <div className={styles.navbar}>
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
            icon={<AssignmentIcon />}
            label="Stay assignments"
          >
            <NavbarSubItem
              path="/administrator/stayAssignments"
              label="All stay assignments"
            />
          </NavbarItem>
          <NavbarItem
            path="/administrator/groupAssignments"
            icon={<FilterNoneIcon />}
            label="Group assignments"
          >
            <NavbarSubItem
              path="/administrator/groupAssignments"
              label="All group assignments"
            />
          </NavbarItem>
          <NavbarItem
            path="/administrator/orderedGroupAssignments"
            icon={<Filter1Icon />}
            label="Ordered assignments"
          >
            <NavbarSubItem
              path="/administrator/orderedGroupAssignments"
              label="All ordered group assignments"
            />
          </NavbarItem>
        </>
      )}
      {isParticipant && (
        <>
          <NavbarItem
            path="/participant/stayAssignments"
            icon={<AssignmentIcon />}
            label="Stay assignments"
          >
            <NavbarSubItem
              path="/participant/stayAssignments"
              label="Assigned to me"
            />
          </NavbarItem>
          <NavbarItem path="/help" icon={<HelpIcon />} label="Help">
            <NavbarSubItem
              path="/help/instructions#using_the_tool"
              label="Using the tool"
            />
            <NavbarSubItem
              path="/help/instructions#assigned_stays"
              label="Assigned stays"
            />
            <NavbarSubItem
              path="/help/instructions#creating_labels"
              label="Creating labels"
            />
          </NavbarItem>
        </>
      )}
    </div>
  );
}
