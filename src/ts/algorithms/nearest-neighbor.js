import {distance, range, svgPathFromPoints} from "../../util.js";

function findPath(origin, points, ttl = Infinity) {
  if (points.length === 0 || ttl < 1)
    return [];

  let nearest = findNearestPoint(origin, points);

  return [
    nearest,
    ...findPath(nearest, points.filter(point => point !== nearest), ttl - 1)
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

let nearestNeighborPath = function(points, ttl = Infinity) {
  let [first, rest] = [points[0], points.slice(1)];

  return [first, ...findPath(first, rest, ttl), first];
};

nearestNeighborPath.debug = function(points) {
  return range(1, points.length).map((ttl) => {
    let path = nearestNeighborPath(points, ttl).slice(0, -1);
    return (
      <path d={svgPathFromPoints(path)} fill="none" stroke="gray" strokeWidth="2" />
    );
  });
};

export {nearestNeighborPath as default};
