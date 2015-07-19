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

export function distance(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy);
}

export function pathLength(points) {
  return points.reduce((d, point, i) => {
    if (i === 0) return 0;
    return d + distance(points[i - 1], point);
  }, 0);
}
