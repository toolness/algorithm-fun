class Node {
  constructor(vertex, parent) {
    this.vertex = vertex;
    this.parent = parent;
  }

  childCount() {
    return (this.exitTime - this.entryTime) / 2;
  }

  toString() {
    return (this.parent ? (this.parent.toString() + ` -> ${this.vertex}`)
                        : this.vertex);
  }
}

function *dfs(graph, root, nodes = null, parent = null) {
  nodes = nodes || {__time: 0};

  nodes[root] = new Node(root, parent);
  nodes[root].entryTime = ++nodes.__time;

  yield {
    node: nodes[root],
    phase: 'enter'
  }

  for (let child of graph[root]) {
    if (!(child in nodes)) {
      yield *dfs(graph, child, nodes, nodes[root]);
    }
  }

  nodes[root].exitTime = nodes.__time++;

  yield {
    node: nodes[root],
    phase: 'exit'
  }
}

export {dfs as default};
