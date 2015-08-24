import dfs from "./index.js";

describe("dfs", () => {
  it("should work", () => {
    let iter = dfs({
      A: ['B', 'C'],
      B: ['A', 'C'],
      C: ['A', 'D'],
      D: ['C']
    }, 'A');
    [...iter].map(node => node.vertex).should.eql(['A', 'B', 'C', 'D']);
  });
});
