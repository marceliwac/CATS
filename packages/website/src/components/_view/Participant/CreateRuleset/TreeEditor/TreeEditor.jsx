import React from 'react';
import Tree from 'react-d3-tree';
import styles from './TreeEditor.module.scss';
import TreeEditorConfig from './TreeEditorConfig';
import CustomNode from './Nodes/CustomNode/CustomNode';
import useTreeEditor from '../../../../../hooks/useTreeEditor';

export default function TreeEditor() {
  const { data } = useTreeEditor();

  return (
    <Tree
      data={data}
      translate={{ x: 0, y: 0 }}
      draggable
      pathFunc="step"
      nodeSize={{
        x: TreeEditorConfig.nodeSize.x,
        y: TreeEditorConfig.nodeSize.y,
      }}
      hasInteractiveNodes
      depthFactor={TreeEditorConfig.depthFactor}
      separation={TreeEditorConfig.separation}
      renderCustomNodeElement={({ nodeDatum }) => (
        <CustomNode nodeDatum={nodeDatum} />
      )}
    />
  );
}
