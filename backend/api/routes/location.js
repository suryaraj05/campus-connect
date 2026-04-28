import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/location/geocode
 * Geocode an address to coordinates
 * Note: For Leaflet, we'll use OpenStreetMap Nominatim (free)
 */
router.post('/geocode', authenticate, async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      });
    }

    // Use OpenStreetMap Nominatim API (free, no API key needed)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    
    try {
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'CampusConnect/1.0' // Required by Nominatim
        }
      });
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        res.json({
          success: true,
          data: {
            address: result.display_name,
            coordinates: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon)
            }
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }
    } catch (fetchError) {
      console.error('Geocoding error:', fetchError);
      res.status(500).json({
        success: false,
        message: 'Failed to geocode address. Please try again.'
      });
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to geocode address'
    });
  }
});

/**
 * GET /api/location/markers
 * Get all grievance locations as map markers
 */
router.get('/markers', authenticate, async (req, res) => {
  try {
    const { grievanceService } = await import('../services/firebaseService.js');
    
    const filters = {
      status: req.query.status,
      department: req.query.department,
      limit: 100 // Limit for map markers
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });

    const grievances = await grievanceService.getAll(filters);

    // Convert to markers format
    const markers = grievances
      .filter(g => g.location) // Only include grievances with location
      .map(g => ({
        id: g.grievanceId,
        title: g.title,
        location: g.location,
        priority: g.priority,
        status: g.status,
        departments: g.departments
      }));

    res.json({
      success: true,
      data: markers,
      count: markers.length
    });
  } catch (error) {
    console.error('Error getting markers:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get markers'
    });
  }
});

/**
 * POST /api/location/route
 * Get route between two points
 * Note: For Leaflet, we'll use OpenRouteService (free) or return coordinates for client-side routing
 */
router.post('/route', authenticate, async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'From and to locations are required. Provide coordinates: {lat, lng}'
      });
    }

    // Validate coordinates
    const fromLat = typeof from === 'object' ? from.lat : parseFloat(from);
    const fromLng = typeof from === 'object' ? from.lng : parseFloat(from);
    const toLat = typeof to === 'object' ? to.lat : parseFloat(to);
    const toLng = typeof to === 'object' ? to.lng : parseFloat(to);

    if (isNaN(fromLat) || isNaN(fromLng) || isNaN(toLat) || isNaN(toLng)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Provide {lat, lng} for both from and to locations.'
      });
    }

    // For Leaflet, we return coordinates and let the client handle routing
    // Or use OpenRouteService API (free, but requires API key)
    // For now, return coordinates for client-side routing with Leaflet Routing Machine
    
    res.json({
      success: true,
      data: {
        from: { lat: fromLat, lng: fromLng },
        to: { lat: toLat, lng: toLng },
        message: 'Use Leaflet Routing Machine on client side for route visualization. Coordinates provided.',
        hint: 'Install leaflet-routing-machine package in Flutter/React to display route on map.'
      }
    });
  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate route'
    });
  }
});

export default router;

