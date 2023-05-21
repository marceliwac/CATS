import React from 'react';
import styles from './RuleNode.module.scss';
import useTreeEditor from '../../../../../../../hooks/useTreeEditor';
import RuleNodeForm from './RuleNodeForm/RuleNodeForm';

export default function RuleNode(props) {
  const { nodeDatum } = props;
  const {
    attributes: { id, nodeType, operation, parameter, value },
  } = nodeDatum;

  const { toggleNodeType, addNode, removeNode } = useTreeEditor();

  return (
    <div className={styles.ruleNode}>
      <button type="button" onClick={() => toggleNodeType(id)}>
        Change type
      </button>
      <button type="button" onClick={() => addNode(id)}>
        Add node
      </button>
      <button type="button" onClick={() => removeNode(id)}>
        Remove node
      </button>
      <p>
        <b>id:</b> {id}
      </p>
      <p>
        <b>nodeType:</b> {nodeType}
      </p>
      <RuleNodeForm operation={operation} parameter={parameter} value={value} />
    </div>
  );
}
