/**
 * Traveling Salesman Problem (TSP) solver for route optimization
 * Groups nearby grievances and finds optimal route to visit them all
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

/**
 * Group grievances by proximity
 * @param {Array} grievances - Array of grievances with latitude/longitude
 * @param {number} maxDistance - Maximum distance in meters to group (default: 500m)
 * @returns {Array} Array of groups, each containing nearby grievances
 */
export function groupByProximity(grievances, maxDistance = 500) {
  const groups = [];
  const processed = new Set();

  for (let i = 0; i < grievances.length; i++) {
    if (processed.has(i)) continue;

    const group = [grievances[i]];
    processed.add(i);

    // Find all grievances within maxDistance
    for (let j = i + 1; j < grievances.length; j++) {
      if (processed.has(j)) continue;

      const g1 = grievances[i];
      const g2 = grievances[j];

      if (!g1.latitude || !g1.longitude || !g2.latitude || !g2.longitude) {
        continue;
      }

      const distance = calculateDistance(
        g1.latitude, g1.longitude,
        g2.latitude, g2.longitude
      );

      if (distance <= maxDistance) {
        group.push(grievances[j]);
        processed.add(j);
      }
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Solve TSP using nearest neighbor heuristic
 * @param {Array} grievances - Array of grievances with coordinates
 * @param {Object} startLocation - Starting location {latitude, longitude}
 * @returns {Object} Optimal route with order and total distance
 */
export function solveTSP(grievances, startLocation = null) {
  if (grievances.length === 0) {
    return { route: [], totalDistance: 0 };
  }

  if (grievances.length === 1) {
    return {
      route: [grievances[0]],
      totalDistance: 0,
    };
  }

  // Filter out grievances without coordinates
  const validGrievances = grievances.filter(g => g.latitude && g.longitude);
  
  if (validGrievances.length === 0) {
    return { route: [], totalDistance: 0 };
  }

  // Use first grievance as start if no start location provided
  let currentLat = startLocation?.latitude || validGrievances[0].latitude;
  let currentLon = startLocation?.longitude || validGrievances[0].longitude;

  const route = [];
  const unvisited = [...validGrievances];
  let totalDistance = 0;

  // If start location is provided and not in grievances, start from there
  if (startLocation && !validGrievances.some(g => 
    g.latitude === startLocation.latitude && g.longitude === startLocation.longitude
  )) {
    // Find nearest grievance to start location
    let nearest = unvisited[0];
    let minDist = calculateDistance(
      startLocation.latitude, startLocation.longitude,
      nearest.latitude, nearest.longitude
    );

    for (const g of unvisited) {
      const dist = calculateDistance(
        startLocation.latitude, startLocation.longitude,
        g.latitude, g.longitude
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = g;
      }
    }
    totalDistance += minDist;
    currentLat = nearest.latitude;
    currentLon = nearest.longitude;
  }

  // Nearest neighbor algorithm
  while (unvisited.length > 0) {
    let nearest = null;
    let minDist = Infinity;
    let nearestIndex = -1;

    for (let i = 0; i < unvisited.length; i++) {
      const g = unvisited[i];
      const dist = calculateDistance(
        currentLat, currentLon,
        g.latitude, g.longitude
      );

      if (dist < minDist) {
        minDist = dist;
        nearest = g;
        nearestIndex = i;
      }
    }

    if (nearest) {
      route.push(nearest);
      unvisited.splice(nearestIndex, 1);
      totalDistance += minDist;
      currentLat = nearest.latitude;
      currentLon = nearest.longitude;
    } else {
      break;
    }
  }

  return {
    route,
    totalDistance: Math.round(totalDistance), // Round to nearest meter
    totalDistanceKm: (totalDistance / 1000).toFixed(2),
  };
}

/**
 * Optimize routes for multiple groups of grievances
 * @param {Array} groups - Array of grievance groups
 * @param {Object} startLocation - Starting location
 * @returns {Array} Array of optimized routes for each group
 */
export function optimizeRoutes(groups, startLocation = null) {
  return groups.map(group => ({
    group,
    route: solveTSP(group, startLocation),
  }));
}

