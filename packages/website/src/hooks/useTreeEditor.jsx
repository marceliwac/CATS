import React from 'react';
import uuid from 'react-uuid';
import TreeEditorContext from '../contexts/TreeEditorContext';
import useDidMount from './useDidMount';

export default function useTreeEditor() {
  return React.useContext(TreeEditorContext);
}

function getNewRelationNode() {
  return {
    children: [],
    attributes: {
      id: uuid(),
      nodeType: 'RELATION',
      operation: 'OR',
    },
  };
}

function getNewRuleNode() {
  return {
    attributes: {
      id: uuid(),
      nodeType: 'RULE',
      parameter: '',
      operation: '>',
      value: '',
    },
  };
}

function toggleNodeType(node) {
  const newNodeType = node.attributes.nodeType === 'RULE' ? 'RELATION' : 'RULE';

  node.attributes.nodeType = newNodeType;
  if (newNodeType === 'RULE') {
    delete node.children;
    node.attributes = { ...getNewRuleNode().attributes };
  } else {
    node.attributes = { ...getNewRelationNode().attributes };
  }
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

function updateStyleAttributes(node, parentRelation) {
  // Set as root node
  if (!parentRelation) {
    node.attributes.isRoot = true;
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    node.children.forEach((child) => {
      updateStyleAttributes(child, node.attributes.operation);
    });
  }
  if (parentRelation) {
    node.attributes.leftClass =
      parentRelation === 'OR' ? 'left-or' : 'left-and';
  }
  if (node.attributes.nodeType === 'RULE') {
    node.attributes.rightClass = 'right-leaf';
  } else if (node.attributes.nodeType === 'RELATION') {
    node.attributes.rightClass =
      node.attributes.operation === 'OR' ? 'right-or' : 'right-and';
  }
}

function getIntermediateRelationForRule(node) {
  const intermediateRelation = getNewRelationNode();
  intermediateRelation.attributes.operation =
    node.attributes.operation === '!=' ? 'AND' : 'OR';
  const intermediateRelationRuleOperation =
    node.attributes.operation === '!=' ? '!=' : '=';
  node.attributes.value.forEach((value) => {
    const newRule = getNewRuleNode();
    newRule.attributes.parameter = node.attributes.parameter;
    newRule.attributes.operation = intermediateRelationRuleOperation;
    newRule.attributes.value = value;
    intermediateRelation.children.push(newRule);
  });
  return intermediateRelation;
}

function getRulesetRule(node, nodes) {
  if (Array.isArray(node.children) && node.children.length > 0) {
    node.children.forEach((child) => {
      getRulesetRule(child, nodes);
    });
  }

  if (node.attributes.nodeType === 'RULE') {
    if (Array.isArray(node.attributes.value)) {
      const intermediateRelation = getIntermediateRelationForRule(node);
      getRulesetRule(intermediateRelation, nodes);
    } else {
      nodes.rules.push({ ...node.attributes });
    }
  }

  if (node.attributes.nodeType === 'RELATION') {
    nodes.relations.push({
      ...node.attributes,
      dependencies: Array.isArray(node.children)
        ? node.children.map((childNode) => childNode.attributes.id)
        : [],
    });
  }
}

function formatRuleset(node) {
  const nodes = { rules: [], relations: [] };
  getRulesetRule(node, nodes);
  return {
    root: node.attributes.id,
    ...nodes,
  };
}

export function TreeEditorProvider(props) {
  const { initialData, children } = props;
  const [data, setData] = React.useState(initialData);
  const didMount = useDidMount();

  React.useEffect(() => {
    if (!didMount) {
      setData((currentData) => {
        const newData = { ...currentData };
        updateStyleAttributes(newData);
        return newData;
      });
    }
  }, [didMount]);

  function getRuleset() {
    return formatRuleset(data);
  }

  function toggleType(nodeId) {
    setData((currentData) => {
      const newData = { ...currentData };
      const result = findNodeById(newData, nodeId);
      if (!result) {
        console.warn('Node with selected id does not exist!');
        return newData;
      }
      toggleNodeType(result.node);
      updateStyleAttributes(newData);
      return newData;
    });
  }

  function removeNode(nodeId) {
    setData((currentData) => {
      const newData = { ...currentData };

      const result = findNodeById(newData, nodeId);
      if (!result) {
        console.warn('Node with selected id does not exist!');
        return newData;
      }
      result.parent.children = result.parent.children.filter(
        (n) => n.attributes.id !== nodeId
      );
      return newData;
    });
  }

  function addNode(parentNodeId, nodeType) {
    setData((currentData) => {
      const newData = { ...currentData };
      const result = findNodeById(newData, parentNodeId);
      if (!result) {
        console.warn('Node with selected id does not exist!');
        return newData;
      }
      const { node } = result;
      if (node.attributes.nodeType === 'RULE') {
        toggleNodeType(result.node);
      }
      if (!Array.isArray(node.children)) {
        node.children = [];
      }
      const newNode =
        nodeType === 'RULE' ? getNewRuleNode() : getNewRelationNode();
      node.children.push(newNode);
      updateStyleAttributes(newData);
      return newData;
    });
  }

  const updateNode = React.useCallback((nodeId, newAttributes) => {
    setData((currentData) => {
      const newData = { ...currentData };
      const result = findNodeById(newData, nodeId);
      if (!result) {
        console.warn('Node with selected id does not exist!');
        return newData;
      }
      const { node } = result;
      node.attributes = {
        ...node.attributes,
        ...newAttributes,
      };
      updateStyleAttributes(newData);
      return newData;
    });
  }, []);

  return (
    <TreeEditorContext.Provider
      value={{ data, getRuleset, toggleType, removeNode, addNode, updateNode }}
    >
      {children}
    </TreeEditorContext.Provider>
  );
}
