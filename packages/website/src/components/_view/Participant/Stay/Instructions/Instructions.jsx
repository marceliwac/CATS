import React from 'react';
import styles from './Instructions.module.scss';

export default function Instructions() {
  return (
    <div className={styles.instructions}>
      <p>
        1. Select a date that will mark either start or end of a{' '}
        <span className={styles.targetLabel}>
          period of time during which weaning takes place
        </span>
        .
        <br />
        <em>
          You can do this by clicking on the table header corresponding to the
          date you wish to select.
        </em>{' '}
      </p>
      <p>
        2. Select a date that will mark the second boundary of the interval.
      </p>
      <p>
        3. Ensure that the dates displayed below are valid and press the save
        button below.
      </p>
      <p>
        4. Create as many labels as you see fit and submit all of them together
        by pressing the submit button.
      </p>
      <p>
        <em>
          If you have selected a wrong date, simply press reset button to clear
          the selected dates.
        </em>
      </p>
    </div>
  );
}
