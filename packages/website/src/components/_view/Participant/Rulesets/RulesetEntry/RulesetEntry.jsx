import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RulesetEntry.module.scss';
import Menu from '../../../Common/Menu/Menu';
import RulesetStatus from '../../../Common/RulesetStatus/RulesetStatus';

export default function RulesetEntry(props) {
  const { id, name, status, ruleCount, relationCount } = props;
  const navigate = useNavigate();

  const menuOptions = [
    {
      label: `Preview`,
      handler: () => navigate(`/participant/rulesets/${id}/preview`),
    },
    {
      label: `View statistics`,
      handler: () => navigate(`/participant/rulesets/${id}`),
    },
    {
      label: `Duplicate`,
      handler: () =>
        navigate(`/participant/rulesets/create?entrypointRulesetId=${id}`),
    },
  ];

  return (
    <div className={styles.rulesetEntry}>
      <a href={`/participant/rulesets/${id}`} className={styles.data}>
        <p className={styles.name}>{name}</p>
        <p className={styles.counts}>
          {relationCount} relation
          {relationCount !== 1 ? 's' : ''} {ruleCount} rule
          {ruleCount !== 1 ? 's' : ''}
        </p>
        <RulesetStatus status={status} />
      </a>
      <div className={styles.controls}>
        <Menu id={`${id}-menu`} items={menuOptions} />
      </div>
    </div>
  );
}
