import React from 'react';
import styles from './Instructions.module.scss';

export default function Instructions() {
  return (
    <div className={styles.instructions}>
      <p>
        In order to begin a process of machine learning we are trying to capture
        the times when a patient is being weaned from mechanical ventilation. We
        want you to identify the{' '}
        <span className={styles.targetLabel}>
          points at which the support patient is receiving from the ventilator
          is being reduced
        </span>
        .
      </p>

      <p>
        The data comes from a real data set, so there will be{' '}
        <em>ups and downs</em>. You will likely need to identify more than one
        period when weaning happens and then stops. In some admissions, patients
        will not be weaned at all - for those cases, simply mark the admission
        as labelled without creating labels.
      </p>
      <div className={styles.process}>
        <div className={styles.step}>
          <div className={styles.header}>
            <div className={styles.stepNumber}>
              <h2>1</h2>
            </div>
            <h2>Select Dates</h2>
          </div>
          <div className={styles.content}>
            <p>
              Using the table below, select two dates which will mark start and
              end of a{' '}
              <span className={styles.targetLabel}>
                period of time during which weaning takes place
              </span>
              .
              <br />
              <em>
                You can do this by hovering over the dates in the table header
                and clicking buttons to mark the ends of an interval. The left
                button marks the start date and the right button marks the end
                date. You can specify the same start and end date if you wish to
                do so.
              </em>{' '}
            </p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.header}>
            <div className={styles.stepNumber}>
              <h2>2</h2>
            </div>
            <h2>Describe the label</h2>
          </div>
          <div className={styles.content}>
            <p>
              Fill out appropriate fields in the form outlining the current
              label. This includes your confidence in the accuracy of the label,
              parameters which led you to apply the label in the first place and
              optionally, the specific changes to those parameters.
            </p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.header}>
            <div className={styles.stepNumber}>
              <h2>3</h2>
            </div>
            <h2>Save label</h2>
          </div>
          <div className={styles.content}>
            <p>
              Ensure that the details of the label are correct and save it using
              the save button to persist the label.
            </p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.header}>
            <div className={styles.stepNumber}>
              <h2>4</h2>
            </div>
            <h2>Submit labels</h2>
          </div>
          <div className={styles.content}>
            <p>
              When you are happy with the set of labels created for this
              admission, simply press the green button to submit the labels.
              Upon successful submission, you will be redirected to your next
              assigned admission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
