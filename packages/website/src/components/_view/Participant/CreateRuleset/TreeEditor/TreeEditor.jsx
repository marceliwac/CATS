import React from 'react';
import Tree from 'react-d3-tree';
import styles from './TreeEditor.module.scss';
import TreeEditorConfig from './TreeEditorConfig';
import CustomNode from './Nodes/CustomNode/CustomNode';
import useTreeEditor from '../../../../../hooks/useTreeEditor';

export default function TreeEditor() {
  const { data, getRuleset } = useTreeEditor();
  const treeRef = React.useRef();
  return (
    <>
      <button
        type="button"
        onClick={() => {
          console.log(getRuleset());
        }}
      >
        Get ruleset
      </button>
      <Tree
        ref={treeRef}
        data={{ ...data }}
        translate={{ x: 0, y: 0 }}
        draggable
        pathFunc="step"
        nodeSize={{
          x: TreeEditorConfig.nodeSize.x,
          y: TreeEditorConfig.nodeSize.y,
        }}
        rootNodeClassName={styles.nodeOverride}
        branchNodeClassName={styles.nodeOverride}
        leafNodeClassName={styles.nodeOverride}
        svgClassName={styles.svgOverride}
        hasInteractiveNodes
        depthFactor={TreeEditorConfig.depthFactor}
        separation={TreeEditorConfig.separation}
        renderCustomNodeElement={({ nodeDatum }) => (
          <CustomNode nodeDatum={nodeDatum} />
        )}
      />
    </>
  );
}
