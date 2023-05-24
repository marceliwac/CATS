import React from 'react';
import styles from './RuleNode.module.scss';
import useTreeEditor from '../../../../../../../hooks/useTreeEditor';
import RuleNodeForm from './RuleNodeForm/RuleNodeForm';
import Menu from '../../../../../Common/Menu/Menu';

export default function RuleNode(props) {
  const { nodeDatum, setGlobalError } = props;
  const {
    attributes: { id, operation, parameter, value, leftClass, rightClass },
  } = nodeDatum;
  const [error, setError] = React.useState(false);

  function setErrorHandler(a) {
    setGlobalError(a);
    setError(a);
  }

  const { removeNode } = useTreeEditor();

  const menuOptions = [
    {
      label: `Remove this rule`,
      handler: () => removeNode(id),
    },
  ];

  return (
    <>
      <div className={styles.topRow}>
        <Menu id={`${id}-menu`} items={menuOptions} />
      </div>
      <div className={`${styles.ruleNode} ${error ? styles.error : ''}`}>
        <div
          className={`${styles.innerWrapper} ${
            leftClass ? styles[leftClass] : ''
          } ${rightClass ? styles[rightClass] : ''}`}
        >
          <RuleNodeForm
            id={id}
            operation={operation}
            parameter={parameter}
            value={value}
            error={error}
            setError={(a) => setErrorHandler(a)}
          />
        </div>
      </div>
    </>
  );
}
