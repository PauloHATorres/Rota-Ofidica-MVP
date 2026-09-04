export function distanceBetweenCoordinates(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const earthRadiusKm = 6371;

  const toRadians = (degrees) =>
    degrees * (Math.PI / 180);

  const deltaLat =
    toRadians(lat2 - lat1);

  const deltaLon =
    toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(deltaLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
}


export function formatDistance(distance) {
  if (
    distance === null ||
    distance === undefined
  ) {
    return null;
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }

  return `${distance
    .toFixed(1)
    .replace('.', ',')} km`;
}


export function centerHasAntivenoms(
  center,
  requiredAntivenoms = []
) {
  if (requiredAntivenoms.length === 0) {
    return true;
  }

  return requiredAntivenoms.every(
    (required) =>
      center.antivenoms?.includes(required)
  );
}


export function getCompatibleCenters({
  centers,
  referralMode,
  requiredAntivenoms = [],
}) {
  if (referralMode !== 'compatible') {
    return [...centers];
  }

  return centers.filter(
    (center) =>
      centerHasAntivenoms(
        center,
        requiredAntivenoms
      )
  );
}


export function getRecommendedCenters({
  centers,
  userLocation,
  referralMode,
  requiredAntivenoms = [],
}) {
  const compatible =
    getCompatibleCenters({
      centers,
      referralMode,
      requiredAntivenoms,
    });


  if (!userLocation) {
    return compatible.map(
      (center) => ({
        ...center,
        distance: null,
      })
    );
  }


  return compatible
    .map(
      (center) => ({
        ...center,

        distance:
          distanceBetweenCoordinates(
            userLocation.latitude,
            userLocation.longitude,
            center.latitude,
            center.longitude
          ),
      })
    )
    .sort(
      (a, b) =>
        a.distance - b.distance
    );
}


export function openDirections(center) {
  const destination =
    Number.isFinite(center.latitude) &&
    Number.isFinite(center.longitude)
      ? `${center.latitude},${center.longitude}`
      : `${center.name}, ${center.city}`;


  const url =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${encodeURIComponent(
      destination
    )}`;


  window.open(
    url,
    '_blank',
    'noopener,noreferrer'
  );
}