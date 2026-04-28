import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { locationService } from '../services/firebaseService.js';

const router = express.Router();

/**
 * GET /api/campus-locations
 * Get all campus locations (public - for location selection)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const locations = await locationService.getAll();
    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Error getting locations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get locations'
    });
  }
});

/**
 * GET /api/campus-locations/nearby
 * Find nearby locations based on coordinates
 */
router.get('/nearby', authenticate, async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 500 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const nearby = await locationService.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(maxDistance)
    );

    res.json({
      success: true,
      data: nearby
    });
  } catch (error) {
    console.error('Error finding nearby locations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to find nearby locations'
    });
  }
});

/**
 * POST /api/campus-locations
 * Create a new campus location (admin only)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create locations'
      });
    }

    const { name, description, latitude, longitude, category, icon } = req.body;

    if (!name || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Name, latitude, and longitude are required'
      });
    }

    const locationData = {
      name: name.trim(),
      description: description?.trim() || '',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      category: category || 'general',
      icon: icon || 'location_on',
    };

    const location = await locationService.create(locationData);

    res.status(201).json({
      success: true,
      data: location,
      message: 'Location created successfully'
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create location'
    });
  }
});

/**
 * PUT /api/campus-locations/:id
 * Update a campus location (admin only)
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update locations'
      });
    }

    const { name, description, latitude, longitude, category, icon } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || '';
    if (latitude !== undefined) updates.latitude = parseFloat(latitude);
    if (longitude !== undefined) updates.longitude = parseFloat(longitude);
    if (category !== undefined) updates.category = category;
    if (icon !== undefined) updates.icon = icon;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const location = await locationService.update(req.params.id, updates);

    res.json({
      success: true,
      data: location,
      message: 'Location updated successfully'
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update location'
    });
  }
});

/**
 * DELETE /api/campus-locations/:id
 * Delete a campus location (admin only)
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete locations'
      });
    }

    await locationService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete location'
    });
  }
});

export default router;

