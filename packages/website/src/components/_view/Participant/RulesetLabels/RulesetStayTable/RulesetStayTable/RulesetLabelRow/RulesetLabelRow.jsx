import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import styles from '../RulesetStayTable.module.scss';

function getRuleOperation(operation) {
  switch (operation) {
    case '=':
      return 'equal to';
    case '<':
      return 'smaller than';
    case '>':
      return 'greater than';
    case '!=':
      return 'not equal to';
    case 'inc':
      return 'increases';
    case 'increm':
      return "increases or doesn't change";
    case 'rem':
      return "doesn't change";
    case 'decrem':
      return "decreases or doesn't change";
    case 'dec':
      return 'decreases';
    default:
      return 'unknown operation';
  }
}

function isOperationTemporal(operation) {
  return ['inc', 'increm', 'rem', 'decrem', 'dec'].includes(operation);
}

function getRuleParameter(parameterKey, parameters) {
  const matchingParameters = parameters.filter(
    (param) => param.key === parameterKey
  );
  if (matchingParameters.length !== 1) {
    return 'Unknown parameter';
  }
  return matchingParameters[0].label;
}

function ruleIdToRuleDescription(id, ruleset, parameters) {
  const matchingRules = ruleset.rules.filter((rule) => rule.id === id);
  if (matchingRules.length !== 1) {
    return 'Unknown';
  }
  const rule = matchingRules[0];
  const isTemporal = isOperationTemporal(rule.operation);
  const operation = getRuleOperation(rule.operation);
  const parameter = getRuleParameter(rule.parameter, parameters);
  const value = rule.vale === null ? '(none)' : rule.value;
  if (isTemporal) {
    return `${parameter} ${operation}`;
  }
  return `${parameter} ${operation} ${value}`;
}

export default function RulesetLabelRow(props) {
  const { columns, labels, ruleset, parameters } = props;
  function getMatchingLabel(charttime) {
    for (let i = 0; i < labels.length; i += 1) {
      if (charttime >= labels[i].startTime && charttime <= labels[i].endTime) {
        return labels[i];
      }
    }
    return null;
  }

  return (
    <TableRow
      key="rulesetLabelRow"
      className={`${styles.labelRow} ${styles.lastLabel}`}
      style={{
        top: `${4.9375}em`,
      }}
    >
      {columns.map((column, columnIndex) => {
        const key = `rulesetLabelRowCell-${columnIndex}-${column.id}`;

        if (columnIndex === 0) {
          return (
            <TableCell
              key={key}
              className={`${styles.parameterCell} ${styles.labelCell}`}
            />
          );
        }

        const matchingLabel = getMatchingLabel(column.id);

        if (matchingLabel) {
          const appliedRuleIds = [];
          const appliedRules = matchingLabel.metadata.appliedRules.filter(
            (rules) => rules.charttime === column.id
          );
          if (appliedRules.length === 1) {
            appliedRuleIds.push(...appliedRules[0].ruleIds);
          }
          return (
            <TableCell
              key={key}
              className={`${styles.labelCell} ${styles.label} ${styles.inRange}`}
            >
              {appliedRuleIds.length === 0 ? (
                <p className={`${styles.matches} ${styles.noMatches}`}>
                  No rules matched
                </p>
              ) : (
                <Tooltip
                  title={
                    // eslint-disable-next-line
                    <div className={styles.tooltip}>
                      <h1>Applied rules</h1>
                      {appliedRuleIds.map((ruleId) => (
                        <div>
                          <p>
                            {ruleIdToRuleDescription(
                              ruleId,
                              ruleset,
                              parameters
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  }
                >
                  <p className={styles.matches}>
                    {appliedRuleIds.length}{' '}
                    {appliedRuleIds.length === 1 ? 'rule' : 'rules'} matched
                  </p>
                </Tooltip>
              )}
            </TableCell>
          );
        }

        return (
          <TableCell
            key={key}
            className={`${styles.labelCell} ${styles.nonLabel}`}
          />
        );
      })}
    </TableRow>
  );
}
