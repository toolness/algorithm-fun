function* rangeGenerator(start, stop) {
  for (var i = start; i < stop; i++) {
    yield i;
  }
}

export function range(start, stop = null) {
  if (stop === null)
    [stop, start] = [start, 0];
  return [...rangeGenerator(start, stop)];
}
