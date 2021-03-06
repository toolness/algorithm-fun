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

export function svgPathFromPoints(path) {
  return path.map((point, i) => {
    return (i === 0 ? "M " : "L ") + `${point.x},${point.y}`;
  }).join(" ");
}

// http://stackoverflow.com/a/8495740
export function* partitionArray(array, chunkSize) {
  chunkSize -= 1;
  let i, j, temparray;
  for (let i = 0, j = array.length; i < j; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}
