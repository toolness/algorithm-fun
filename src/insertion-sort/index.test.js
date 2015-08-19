import insertionSort from "./index.js";

describe("insertionSort()", () => {
  it("should sort arrays of length 0", () => {
    insertionSort([]).should.eql([]);
  });

  it("should sort arrays of length 1", () => {
    insertionSort([1]).should.eql([1]);
  });

  it("should sort arrays of length > 1", () => {
    insertionSort([3, 1, 2]).should.eql([1, 2, 3]);
  });

  it("should do nothing to sorted arrays", () => {
    insertionSort([1, 2, 3]).should.eql([1, 2, 3]);
  });
});
