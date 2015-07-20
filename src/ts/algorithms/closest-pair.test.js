import {distinctEndpointPairs} from "./closest-pair.js";

describe("closestPair", () => {
  describe("distinctEndpointPairs()", () => {
    it("should not contain duplicate unordered pairs", () => {
      [...distinctEndpointPairs([[{x: 0, y: 0}], [{x: 1, y: 1}]])]
        .map(p => [p.a, p.b])
        .should.eql([[{x: 0, y: 0}, {x: 1, y: 1}]]);
    });
  });
});
