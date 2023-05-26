import React from 'react';
import styles from './CustomNode.module.scss';
import RelationNode from '../RelationNode/RelationNode';
import RuleNode from '../RuleNode/RuleNode';
import TreeEditorConfig from '../../TreeEditorConfig';

export default function CustomNode(props) {
  const { nodeDatum } = props;
  const {
    attributes: { id, nodeType },
  } = nodeDatum;
  let Node = () => <p>Invalid node type!</p>;
  if (nodeType === 'RELATION') {
    Node = RelationNode;
  }
  if (nodeType === 'RULE') {
    Node = RuleNode;
  }

  return (
    <>
      <foreignObject
        x={TreeEditorConfig.nodeSize.x / -2}
        y={TreeEditorConfig.nodeSize.y / -2}
        width={TreeEditorConfig.nodeSize.x}
        height={TreeEditorConfig.nodeSize.y}
      >
        <div className={styles.node}>
          <Node key={id} nodeDatum={nodeDatum} />
        </div>
      </foreignObject>
    </>
  );
}
