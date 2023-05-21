export default {
  nodeSize: {
    x: 400,
    y: 200,
  },
  get depthFactor() {
    return this.nodeSize.x * this.separation.siblings;
  },
  separation: {
    siblings: 1.25,
    nonSiblings: 1.5,
  },
};
