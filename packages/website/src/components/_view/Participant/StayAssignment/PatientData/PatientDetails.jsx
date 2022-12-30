import React from 'react';
import styles from './PatientDetails.module.scss';
import useLabeller from '../../../../../hooks/useLabeller';

export default function PatientDetails(props) {
  const { details } = props;
  const { formatDate } = useLabeller();

  const displayGender =
    // eslint-disable-next-line no-nested-ternary
    details.gender === 'M'
      ? 'male'
      : details.gender === 'F'
      ? 'female'
      : 'Unknown';
  const displayAge = details.age ? `${details.age} years old` : 'Unknown';
  const displayRace = details.race ? details.race.toLowerCase() : 'Unknown';
  const displayLengthOfStayHospital = details.lengthOfStayHospital
    ? `${details.lengthOfStayHospital} days`
    : 'Unknown';
  const displayLengthOfStayIcu = details.lengthOfStayIcu
    ? `${details.lengthOfStayIcu} days`
    : 'Unknown';
  const displayAdmissionTime = details.admissionTime
    ? formatDate(details.admissionTime)
    : 'Unknown';
  const displayDischargeTime = details.dischargeTime
    ? formatDate(details.dischargeTime)
    : 'Unknown';
  const displayDeathTime = details.deathTime
    ? formatDate(details.deathTime)
    : '-';

  return (
    <div className={styles.patientDetails}>
      <div className={styles.details}>
        <div className={styles.detail}>
          <p className={styles.label}>Gender</p>
          <p className={styles.value}>{displayGender}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.label}>Age</p>
          <p className={styles.value}>{displayAge}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.label}>Race</p>
          <p className={styles.value}>{displayRace}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.label}>Length of Stay (hospital)</p>
          <p className={styles.value}>{displayLengthOfStayHospital} days</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.label}>Admission Time</p>
          <p className={styles.value}>{displayAdmissionTime}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.label}>Discharge Time</p>
          <p className={styles.value}>{displayDischargeTime}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.label}>Death Time</p>
          <p className={styles.value}>{displayDeathTime}</p>
        </div>
        <div className={styles.detail}>
          <p className={styles.label}>Length of Stay (ICU)</p>
          <p className={styles.value}>{displayLengthOfStayIcu} days</p>
        </div>
      </div>
    </div>
  );
}
