function binarySearchHelper(array, value, maxIterations, start, end) {
  let intervalLength = end - start;

  if (intervalLength == 0) {
    return -1;
  }

  if (intervalLength == 1) {
    if (array[start] == value) {
      return start;
    }
    return -1;
  }

  let medianIndex = start + Math.floor(intervalLength / 2);

  if (array[medianIndex] == value) {
    return medianIndex;
  } else if (array[medianIndex] < value) {
    return binarySearchHelper(array, value, maxIterations - 1,
                              medianIndex, end);
  } else {
    return binarySearchHelper(array, value, maxIterations - 1,
                              0, medianIndex);
  }
}

export default function(array, value, maxIterations) {
  maxIterations = maxIterations || Infinity;
  return binarySearchHelper(array, value, maxIterations, 0, array.length);
}
