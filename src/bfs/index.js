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

function *bfs(graph, root) {
  let nodes = {};
  let toVisit = [root];

  nodes[root] = new Node(root, null);

  while (toVisit.length) {
    let parent = toVisit.shift();
    graph[parent].filter(v => !(v in nodes)).forEach(child => {
      toVisit.push(child);
      nodes[child] = new Node(child, nodes[parent]);
    });
    yield nodes[parent];
  }
}

bfs.find = (graph, root, dest) => {
  for (let node of bfs(graph, root)) {
    if (node.vertex == dest) {
      return node;
    }
  }
};

export {bfs as default};
