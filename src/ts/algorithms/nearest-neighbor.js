function distance(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy);
}

function findPath(origin, points) {
  if (points.length === 0)
    return [];

  let nearest = findNearestPoint(origin, points);

  return [
    nearest,
    ...findPath(nearest, points.filter(point => point !== nearest))
  ];
}

function findNearestPoint(origin, points) {
  let minDistance = Infinity;
  let nearestPoint = null;

  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let d = distance(origin, p);
    if (d < minDistance) {
      minDistance = d;
      nearestPoint = p;
    }
  }

  return nearestPoint;
}

export default function(points) {
  let [first, rest] = [points[0], points.slice(1)];

  return [first, ...findPath(first, rest), first];
}
