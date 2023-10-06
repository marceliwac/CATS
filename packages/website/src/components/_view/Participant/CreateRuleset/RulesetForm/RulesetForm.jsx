import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { OutlinedInput } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RulesetForm.module.scss';
import useTreeEditor from '../../../../../hooks/useTreeEditor';
import APIClient from '../../../../../util/APIClient';

export default function RulesetForm() {
  const navigate = useNavigate();
  const [name, setName] = React.useState('My ruleset');
  const [nameError, setNameError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { getRuleset, getParsedRuleset, hasError } = useTreeEditor();

  async function submit() {
    if (hasError) {
      setErrorMessage(
        'Ruleset is not valid. Please make sure there are no missing values, or delete the nodes that are not needed.'
      );
      return;
    }
    if (nameError) {
      setErrorMessage('Please provide the name for the ruleset.');
      return;
    }
    setErrorMessage(null);

    try {
      setIsSubmitting(true);
      const ruleset = getRuleset();
      const parsedRuleset = getParsedRuleset();
      const response = await APIClient.post('/participant/rulesets', {
        name,
        ruleset,
        parsedRuleset,
      });
      navigate(`/participant/rulesets/${response.data.id}`);
      setErrorMessage(null);
    } catch (e) {
      setErrorMessage('Could not create a ruleset! Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  }

  React.useEffect(() => {
    setNameError(name === '');
  }, [name]);

  return (
    <div className={styles.rulesetForm}>
      <FormControl sx={{ m: 1 }} className={styles.name} error={nameError}>
        <InputLabel id="name">
          {nameError ? 'Ruleset name is required.' : 'Ruleset name'}
        </InputLabel>
        <OutlinedInput
          className={styles.input}
          id="name"
          label={nameError ? 'Ruleset name is required' : 'Ruleset name'}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <LoadingButton
        className={styles.button}
        variant="contained"
        onClick={() => submit()}
        loading={isSubmitting}
      >
        <span>Create ruleset</span>
      </LoadingButton>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
}
