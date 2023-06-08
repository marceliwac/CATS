import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import styles from './Breadcrumbs.module.scss';

// Only render breadcrumbs if the first crumb is one of the below.
const ROOT_BREADCRUMB_WHITELIST = ['administrator', 'participant'];

// Skip the following breadcrumbs if they are at the root
const ROOT_BREADCRUMB_BLACKLIST = ['administrator', 'participant'];

const BREADCRUMB_LUT = {
  users: 'Users',
  administrators: 'Administrators',
  participants: 'Participants',
  invite: 'Invite',
  rulesets: 'Rulesets',
  stayAssignments: 'Stay Assignments',
  groupAssignments: 'Group Assignments',
  orderedGroupAssignments: 'Ordered Group Assignments',
  assign: 'Assign',
  create: 'Create new',
  preview: 'Preview',
  edit: 'Edit',
  signin: 'Sign In',
  signup: 'Sign Up',
};

const UUID_REGEX = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

function getRootFilteredBreadcrumbs(breadcrumbs) {
  if (
    breadcrumbs.length > 0 &&
    ROOT_BREADCRUMB_BLACKLIST.includes(breadcrumbs[0])
  ) {
    return breadcrumbs.slice(1, breadcrumbs.length);
  }
  return breadcrumbs;
}

export default function TopBar() {
  const location = useLocation();

  // Split the path by fragments and remove empty parts (empty strings for first and last slash if
  // present), bring to lower case.
  const breadcrumbs = location.pathname.split('/').filter((crumb) => !!crumb);

  // Only display breadcrumbs if the path begins at one of the whitelisted roots
  if (!ROOT_BREADCRUMB_WHITELIST.includes(breadcrumbs[0])) {
    return <></>;
  }

  // Remove the root breadcrumb if it is on the blacklist
  const rootFilteredBreadcrumbs = getRootFilteredBreadcrumbs(breadcrumbs);
  const removedRootBreadcrumbsOffset =
    breadcrumbs.length - rootFilteredBreadcrumbs.length;

  // Construct breadcrumbs based on components of the path.
  const breadcrumbLinks = rootFilteredBreadcrumbs.map((crumb, index) => {
    const path = `/${breadcrumbs
      .slice(0, index + removedRootBreadcrumbsOffset + 1)
      .join('/')}`;
    let label = '?';
    if (UUID_REGEX.test(crumb) && index !== 0) {
      label = crumb.substring(0, 8);
    } else if (
      Object.keys(BREADCRUMB_LUT)
        .map((c) => c.toLowerCase())
        .includes(crumb.toLowerCase())
    ) {
      label = BREADCRUMB_LUT[crumb];
    }
    return (
      <Link
        className={styles.breadcrumb}
        to={path}
        reloadDocument
        key={path.replace(/\W/g, '')}
      >
        {label}
      </Link>
    );
  });

  return (
    <Breadcrumbs maxItems={5} aria-label="breadcrumb">
      {breadcrumbLinks}
    </Breadcrumbs>
  );
}
