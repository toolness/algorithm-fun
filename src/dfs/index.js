class Node {
  constructor(vertex, parent) {
    this.vertex = vertex;
    this.parent = parent;
  }

  toString() {
    return (this.parent ? (this.parent.toString() + ` -> ${this.vertex}`)
                        : this.vertex);
  }
}

function *dfs(graph, root, nodes = null, parent = null) {
  nodes = nodes || {};

  nodes[root] = new Node(root, parent);

  yield nodes[root];

  for (let child of graph[root]) {
    if (!(child in nodes)) {
      yield *dfs(graph, child, nodes, nodes[root]);
    }
  }
}

export {dfs as default};
