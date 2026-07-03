// Great-circle geometry helpers used to fly planes along realistic curved paths.

function toRad(deg) { return (deg * Math.PI) / 180; }
function toDeg(rad) { return (rad * 180) / Math.PI; }

function haversineDistanceKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function toVec3(p) {
  const lat = toRad(p.lat);
  const lng = toRad(p.lng);
  return {
    x: Math.cos(lat) * Math.cos(lng),
    y: Math.cos(lat) * Math.sin(lng),
    z: Math.sin(lat),
  };
}

function fromVec3(v) {
  const lat = toDeg(Math.atan2(v.z, Math.sqrt(v.x * v.x + v.y * v.y)));
  const lng = toDeg(Math.atan2(v.y, v.x));
  return { lat, lng };
}

// Spherical linear interpolation between two lat/lng points, t in [0,1].
function slerp(a, b, t) {
  const v1 = toVec3(a);
  const v2 = toVec3(b);
  const dot = Math.max(-1, Math.min(1, v1.x * v2.x + v1.y * v2.y + v1.z * v2.z));
  const theta = Math.acos(dot);
  if (theta < 1e-9) return { lat: a.lat, lng: a.lng };
  const sinTheta = Math.sin(theta);
  const w1 = Math.sin((1 - t) * theta) / sinTheta;
  const w2 = Math.sin(t * theta) / sinTheta;
  return fromVec3({
    x: w1 * v1.x + w2 * v2.x,
    y: w1 * v1.y + w2 * v2.y,
    z: w1 * v1.z + w2 * v2.z,
  });
}

// Initial bearing in degrees clockwise from north, from point a toward point b.
function bearing(a, b) {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
