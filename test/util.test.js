import * as util from "../src/util.js";

describe("util.range()", function() {
  it("should work with one argument", function() {
    util.range(3).should.eql([0, 1, 2]);
  });

  it("should work with two arguments", function() {
    util.range(3, 5).should.eql([3, 4]);
  });
});

console.log("import util");
