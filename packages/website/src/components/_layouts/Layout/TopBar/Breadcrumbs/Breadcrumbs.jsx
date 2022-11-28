import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import styles from './Breadcrumbs.module.scss';

const ROOT_BREADCRUMB_WHITELIST = ['administrator', 'researcher'];
const ROOT_BREADCRUMB_BLACKLIST = ['administrator', 'researcher'];

const BREADCRUMB_LUT = {
  studies: 'Studies',
  questionnaires: 'Questionnaires',
  schedules: 'Schedules',
  administrators: 'Administrators',
  researchers: 'Researchers',
  participants: 'Participants',
  create: 'Create new',
  invite: 'Invite',
  users: 'Users',
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
  const breadcrumbs = location.pathname
    .split('/')
    .filter((crumb) => !!crumb)
    .map((crumb) => crumb.toLowerCase());

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
    } else if (Object.keys(BREADCRUMB_LUT).includes(crumb)) {
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
