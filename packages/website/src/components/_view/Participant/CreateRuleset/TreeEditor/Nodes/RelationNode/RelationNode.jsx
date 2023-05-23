import React from 'react';
import styles from './RelationNode.module.scss';
import useTreeEditor from '../../../../../../../hooks/useTreeEditor';
import RelationNodeForm from './RelationNodeForm/RelationNodeForm';
import Menu from '../../../../../Common/Menu/Menu';

export default function RelationNode(props) {
  const { nodeDatum } = props;
  const {
    attributes: { id, isRoot, operation, leftClass, rightClass },
  } = nodeDatum;
  const { addNode, removeNode } = useTreeEditor();

  const menuOptions = [
    {
      label: `Add rule`,
      handler: () => addNode(id, 'RULE'),
    },
    {
      label: `Add relation`,
      handler: () => addNode(id, 'RELATION'),
    },
    {
      label: `Remove this relation`,
      handler: () => {
        removeNode(id);
      },
      disabled: isRoot,
    },
  ];

  return (
    <>
      <div className={styles.topRow}>
        <Menu id={`${id}-menu`} items={menuOptions} />
      </div>
      <div className={styles.relationNode}>
        <div
          className={`${styles.innerWrapper} ${
            leftClass ? styles[leftClass] : ''
          } ${rightClass ? styles[rightClass] : ''}
         ${isRoot ? styles.root : ''}`}
        >
          <RelationNodeForm id={id} operation={operation} />
        </div>
      </div>
    </>
  );
}
