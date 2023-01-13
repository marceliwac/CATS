import React from 'react';
import styles from './PatientDetails.module.scss';
import useLabeller from '../../../../../hooks/useLabeller';

function formatLengthOfTime(length) {
  const days = Math.floor(length);
  const hours = Math.floor((length - days) * 24);
  if (days === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (hours === 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  return `${days} day${days > 1 ? 's' : ''} and ${hours} hour${
    hours > 1 ? 's' : ''
  }`;
}

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
  const displayAge = details.age
    ? `${Math.floor(details.age)} years old`
    : 'Unknown';
  const displayRace = details.race ? details.race.toLowerCase() : 'Unknown';
  const displayLengthOfStayHospital = details.lengthOfStayHospital
    ? formatLengthOfTime(details.lengthOfStayHospital)
    : 'Unknown';
  const displayLengthOfStayIcu = details.lengthOfStayIcu
    ? formatLengthOfTime(details.lengthOfStayIcu)
    : 'Unknown';
  const displayAdmissionTime = details.admissionTime
    ? formatDate(new Date(details.admissionTime))
    : 'Unknown';
  const displayDischargeTime = details.dischargeTime
    ? formatDate(new Date(details.dischargeTime))
    : 'Unknown';
  const displayDeathTime = details.deathTime
    ? formatDate(new Date(details.deathTime))
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
          <p className={styles.value}>{displayLengthOfStayHospital}</p>
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
          <p className={styles.value}>{displayLengthOfStayIcu}</p>
        </div>
      </div>
    </div>
  );
}
