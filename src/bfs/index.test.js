import bfs from "./index.js";

describe("bfs", () => {
  it("find() should find shortest path", () => {
    bfs.find({
      A: ['B', 'C'],
      B: ['A', 'C'],
      C: ['A', 'D'],
      D: ['C']
    }, 'A', 'D').toString().should.eql('A -> C -> D');
  });
});
