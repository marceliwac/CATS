import React from 'react';
import uuid from 'react-uuid';
import TreeEditorContext from '../contexts/TreeEditorContext';
import TreeEditorConfig from '../components/_view/Participant/CreateRuleset/TreeEditor/TreeEditorConfig';
import useDidMount from './useDidMount';

export default function useTreeEditor() {
  return React.useContext(TreeEditorContext);
}

// This won't copy functions and will fail on circular refs.
function deepCopy(a) {
  return JSON.parse(JSON.stringify(a));
}

function isNumeric(a) {
  return (
    typeof a === 'number' ||
    (typeof a === 'string' && !Number.isNaN(a) && !Number.isNaN(parseFloat(a)))
  );
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
    nodes.rules.push({ ...node.attributes });
  }

  if (node.attributes.nodeType === 'RELATION') {
    nodes.relations.push({
      ...node.attributes,
      dependencies: node.children.map((childNode) => childNode.attributes.id),
    });
  }
}

function formatRelations(relations) {
  return relations
    .filter((relation) => relation.dependencies.length > 0)
    .map((relation) => ({
      id: relation.id,
      operation: relation.operation,
      dependencies: relation.dependencies,
    }));
}

function formatRules(rules) {
  return rules.map((rule) => {
    let ruleOperation = rule.operation;
    let ruleValue = isNumeric(rule.value) ? parseFloat(rule.value) : rule.value;
    if (ruleOperation === TreeEditorConfig.operationNotSet) {
      ruleOperation = '=';
      ruleValue = '';
    }
    if (ruleValue === TreeEditorConfig.noneOptionValue) {
      ruleValue = '';
    }
    if (ruleValue === '') {
      ruleValue = null;
    }

    return {
      id: rule.id,
      operation: ruleOperation,
      parameter: rule.parameter,
      value: ruleValue,
    };
  });
}

function simplifyComplexRules(node) {
  // Handle relation with children
  if (Array.isArray(node.children) && node.children.length > 0) {
    node.children.forEach((child) => {
      simplifyComplexRules(child);
    });
  }

  // Handle complex rule
  if (
    node.attributes.nodeType === 'RULE' &&
    Array.isArray(node.attributes.value)
  ) {
    const intermediateRelation = getIntermediateRelationForRule(node);
    node.attributes = intermediateRelation.attributes;
    node.children = intermediateRelation.children;
  }
}

function formatRuleset(node) {
  const nodes = { rules: [], relations: [] };
  const simplified = deepCopy(node);
  simplifyComplexRules(simplified);
  getRulesetRule(simplified, nodes);
  const { rules, relations } = nodes;
  return {
    root: node.attributes.id,
    rules: formatRules(rules),
    relations: formatRelations(relations),
  };
}

export function TreeEditorProvider(props) {
  const { initialData, children } = props;
  const [data, setData] = React.useState(initialData);
  const didMount = useDidMount();

  React.useEffect(() => {
    if (!didMount) {
      setData((currentData) => {
        const newData = deepCopy(currentData);
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
      const newData = deepCopy(currentData);
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
      const newData = deepCopy(currentData);

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
      const newData = deepCopy(currentData);
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
      const newData = deepCopy(currentData);
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
      value={{
        data,
        getRuleset,
        toggleType,
        removeNode,
        addNode,
        updateNode,
        isNumeric,
      }}
    >
      {children}
    </TreeEditorContext.Provider>
  );
}
