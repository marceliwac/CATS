import React from 'react';
import styles from './RuleNode.module.scss';
import useTreeEditor from '../../../../../../../hooks/useTreeEditor';
import RuleNodeForm from './RuleNodeForm/RuleNodeForm';
import Menu from '../../../../../Common/Menu/Menu';

export default function RuleNode(props) {
  const { nodeDatum } = props;
  const {
    attributes: { id, operation, parameter, value, leftClass, rightClass },
  } = nodeDatum;

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
      <div className={styles.ruleNode}>
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
          />
        </div>
      </div>
    </>
  );
}
