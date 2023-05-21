import React from 'react';
import styles from './RelationNode.module.scss';
import useTreeEditor from '../../../../../../../hooks/useTreeEditor';
import RelationNodeForm from './RelationNodeForm/RelationNodeForm';

export default function RelationNode(props) {
  const { nodeDatum } = props;
  const {
    attributes: { id, nodeType, operation },
  } = nodeDatum;
  const { toggleNodeType, addNode, removeNode } = useTreeEditor();
  const [inputOperation, setInputOperation] = React.useState(operation);

  return (
    <div className={styles.relationNode}>
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

      <RelationNodeForm id={id} operation={operation} />
      <p>
        <b>operation:</b> {operation}
      </p>
    </div>
  );
}
