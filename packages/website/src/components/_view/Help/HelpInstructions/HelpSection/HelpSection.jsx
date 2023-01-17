import React from 'react';
import styles from './HelpSection.module.scss';

export default function HelpSection(props) {
  const { children, title, id } = props;

  return (
    <div className={styles.helpSection} id={id}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
