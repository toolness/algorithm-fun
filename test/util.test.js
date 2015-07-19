import {range} from "../src/util.js";

describe("range()", function() {
  it("should work with one argument", function() {
    range(3).should.eql([0, 1, 2]);
  });

  it("should work with two arguments", function() {
    range(3, 5).should.eql([3, 4]);
  });
});

console.log("import util");
