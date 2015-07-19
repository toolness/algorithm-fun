import {distance} from "../../util.js";

class Pair {
  constructor(allChains, chainAi, vertexAi, chainBi, vertexBi) {
    Object.assign(this, {
      allChains,
      chainAi,
      vertexAi,
      chainBi,
      vertexBi,
      chainA: allChains[chainAi],
      chainB: allChains[chainBi],
      a: allChains[chainAi][vertexAi],
      b: allChains[chainBi][vertexBi]
    });
    this.distance = distance(this.a, this.b);
  }
  merge() {
    let chains = this.allChains.filter(chain => {
      return chain !== this.chainA && chain !== this.chainB
    });
    let newChain = null;
    if (this.vertexAi === 0) {
      if (this.vertexBi === 0) {
        newChain = [...this.chainA.slice().reverse(), ...this.chainB];
      } else {
        newChain = [...this.chainB, ...this.chainA];
      }
    } else {
      if (this.vertexBi === 0) {
        newChain = [...this.chainA, ...this.chainB];
      } else {
        newChain = [...this.chainA, ...this.chainB.slice().reverse()];
      }
    }
    return [...chains, newChain];
  }
}

// TODO: This actually returns points like [1,0] and [0,1], yet the
// ordering of the points doesn't matter. Therefore, while this doesn't
// affect the correctness of our heuristic, it does affect our efficiency.
function* distinctEndpointPairs(vertexChains) {
  for (let i = 0; i < vertexChains.length; i++) {
    let a = vertexChains[i];
    for (let j  = 0; j < vertexChains.length; j++) {
      let b = vertexChains[j];
      if (a === b) continue;
      yield new Pair(vertexChains, i, 0, j, 0);
      if (a.length > 1) {
        yield new Pair(vertexChains, i, a.length - 1, j, 0);
      }
      if (b.length > 1) {
        yield new Pair(vertexChains, i, 0, j, b.length - 1);
      }
      if (a.length > 1 && b.length > 1) {
        yield new Pair(vertexChains, i, a.length - 1, j, b.length - 1);
      }
    }
  }
}

export default function(points) {
  let vertexChains = points.map(point => {
    return [point];
  });

  while (vertexChains.length > 1) {
    let minDistance = Infinity;
    let bestPair = null;
    for (let pair of distinctEndpointPairs(vertexChains)) { 
      if (pair.distance < minDistance) {
        minDistance = pair.distance;
        bestPair = pair;
      }
    }
    vertexChains = bestPair.merge();
  }

  return [...vertexChains[0], vertexChains[0][0]];
}
