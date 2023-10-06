import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './Enroll.module.scss';

const PARTICIPANT_INFORMATION_SHEET_LINK =
  process.env.REACT_APP_PARTICIPANT_INFORMATION_SHEET_LINK;

const CONSENT_FORM_LINK = process.env.REACT_APP_CONSENT_FORM_LINK;

export default function Enroll() {
  const [clickedSignConsent, setClickedSignConsent] = React.useState(false);
  const navigate = useNavigate();

  function handleConsentButton() {
    setClickedSignConsent(true);
    window.open(CONSENT_FORM_LINK);
  }

  function handleRegisterForAccount() {
    navigate('/account/signUp');
  }

  return (
    <div className={styles.enroll}>
      <h1>Enroll in the Weaning Labelling Study</h1>
      <p className={styles.description}>
        To enroll in the study, you should follow the three-step process
        outlined below. If at any point in time you run into any technical
        problems, or would simply like to learn more about the study, please
        contact support at{' '}
        <a href="mailto:support@xxxxxxxxx.com">support@xxxxxxxxx.com</a>.
      </p>
      <div className={styles.process}>
        <div className={styles.step}>
          <div className={styles.header}>
            <div className={styles.stepNumber}>
              <h2>1</h2>
            </div>
            <h2>Consent</h2>
          </div>
          <div className={styles.content}>
            <p>
              Prior to registering for an account in the system, you will need
              to familiarise yourself with the{' '}
              <a
                href={PARTICIPANT_INFORMATION_SHEET_LINK}
                target="_blank"
                rel="noreferrer"
              >
                Participant Information Sheet
              </a>{' '}
              and consent to taking part in the study.
            </p>
            <Button
              className={styles.button}
              variant={clickedSignConsent ? 'outlined' : 'contained'}
              onClick={() => handleConsentButton()}
              type="button"
            >
              Sign consent form
            </Button>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.header}>
            <div className={styles.stepNumber}>
              <h2>2</h2>
            </div>
            <h2>Verify signature</h2>
          </div>
          <div className={styles.content}>
            <p>
              Once you sign the consent form online, you will be emailed a link
              which will confirm your electronic signature. Please open your
              email client and verify your signature.
            </p>
            <p>
              If you do not verify your signature, your consent will not be
              registered and we will not be able to use any data you produce
              during the study.
            </p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.header}>
            <div className={styles.stepNumber}>
              <h2>3</h2>
            </div>
            <h2>Register for an account</h2>
          </div>
          <div className={styles.content}>
            <p>
              To continue enrollment you should create an account in the online
              tool. You can do so by pressing the button below. Please ensure
              that you use the same email address you have used to sign the
              consent form.
            </p>
            <Button
              className={styles.button}
              variant="contained"
              onClick={() => handleRegisterForAccount()}
              type="button"
            >
              Create an account
            </Button>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.header}>
            <div className={styles.stepNumber}>
              <h2>4</h2>
            </div>
            <h2>Verify your account</h2>
          </div>
          <div className={styles.content}>
            <p>
              Finally, to complete the process you will need to verify your
              account by pressing a link in the email which will be sent to you
              upon signup. This is separate from verifying the electronic
              signature. You will need to verify your account to be able to sign
              in.
            </p>
            <p className={styles.important}>
              Be sure to check your spam folder!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
