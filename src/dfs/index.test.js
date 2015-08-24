import dfs from "./index.js";

const GRAPH = {
  A: ['B', 'C'],
  B: ['A', 'C'],
  C: ['A', 'D'],
  D: ['C']
};

describe("dfs", () => {
  it("should perform a depth-first traversal", () => {
    [...dfs(GRAPH, 'A')]
      .filter(entry => entry.phase == 'enter')
      .map(entry => entry.node.vertex)
      .should.eql(['A', 'B', 'C', 'D']);
  });

  it("should track entry/exit time and report child count", () => {
    let iter = dfs(GRAPH, 'A');
    let firstNode = iter.next().value.node;
    firstNode.entryTime.should.eql(1);
    while (!iter.next().done);
    firstNode.childCount().should.eql(3);
  });
});
