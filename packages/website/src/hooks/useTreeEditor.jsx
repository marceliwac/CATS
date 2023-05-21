import React from 'react';
import uuid from 'react-uuid';
import TreeEditorContext from '../contexts/TreeEditorContext';

export default function useTreeEditor() {
  return React.useContext(TreeEditorContext);
}

function getNewNode() {
  return {
    attributes: {
      id: uuid(),
      nodeType: 'RELATION',
      operation: '',
    },
  };
}

function findNodeById(node, id, parent) {
  if (node.attributes.id === id) {
    return { node, parent };
  }
  if (!Array.isArray(node.children) || node.children.length === 0) {
    return null;
  }
  for (let i = 0; i < node.children.length; i += 1) {
    const result = findNodeById(node.children[i], id, node);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

export function TreeEditorProvider(props) {
  const { initialData, children } = props;
  const [data, setData] = React.useState(initialData);

  // eslint-disable-next-line no-underscore-dangle
  function _toggleNodeType(node) {
    const newNodeType =
      node.attributes.nodeType === 'RULE' ? 'RELATION' : 'RULE';
    node.attributes.nodeType = newNodeType;
    if (newNodeType === 'RULE') {
      node.attributes.parameter = '';
      node.attributes.value = '';
      node.attributes.operation = '';
      delete node.children;
    } else {
      node.attributes.operation = '';
      delete node.attributes.parameter;
      delete node.attributes.value;
    }
  }

  function toggleNodeType(nodeId) {
    setData((currentData) => {
      currentData = { ...currentData };
      const result = findNodeById(currentData, nodeId);
      if (!result) {
        console.warn('Node with selected id does not exist!');
        return currentData;
      }
      _toggleNodeType(result.node);
      return currentData;
    });
  }

  function removeNode(nodeId) {
    setData((currentData) => {
      currentData = { ...currentData };
      const result = findNodeById(currentData, nodeId);
      if (!result) {
        console.warn('Node with selected id does not exist!');
        return currentData;
      }
      result.parent.children = result.parent.children.filter(
        (n) => n !== result.node
      );
      return currentData;
    });
  }

  function addNode(parentNodeId) {
    setData((currentData) => {
      currentData = { ...currentData };
      const result = findNodeById(currentData, parentNodeId);
      if (!result) {
        console.warn('Node with selected id does not exist!');
        return currentData;
      }
      const { node } = result;
      if (node.attributes.nodeType === 'RULE') {
        _toggleNodeType(node);
      }
      if (!Array.isArray(node.children)) {
        node.children = [];
      }
      node.children.push(getNewNode());
      return currentData;
    });
  }

  const updateNode = React.useCallback((nodeId, newAttributes) => {
    setData((currentData) => {
      currentData = { ...currentData };
      const result = findNodeById(currentData, nodeId);
      if (!result) {
        console.warn('Node with selected id does not exist!');
        return currentData;
      }
      const { node } = result;
      node.attributes = {
        ...node.attributes,
        ...newAttributes,
      };
      return currentData;
    });
  }, []);

  return (
    <TreeEditorContext.Provider
      value={{ data, toggleNodeType, removeNode, addNode, updateNode }}
    >
      {children}
    </TreeEditorContext.Provider>
  );
}
