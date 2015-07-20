import {distance, svgPathFromPoints} from "../../util.js";

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

export function* distinctEndpointPairs(vertexChains) {
  for (let i = 0; i < vertexChains.length; i++) {
    let a = vertexChains[i];
    for (let j = i + 1; j < vertexChains.length; j++) {
      let b = vertexChains[j];
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

function* vertexChainMerger(points) {
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
    yield vertexChains;
  }
}

let closestPairPath = function(points) {
  let vertexChains = null;

  for (vertexChains of vertexChainMerger(points)) {}

  return [...vertexChains[0], vertexChains[0][0]];
};

closestPairPath.debug = function(points) {
  return [...vertexChainMerger(points)].map(vertexChains => {
    return (
      <g>
        {vertexChains.map((points, i) => {
          return <path key={i} fill="none" stroke="gray" strokeWidth="2"
                       d={svgPathFromPoints(points)}/>;
        })}
      </g>
    );
  });
};

export {closestPairPath as default};
