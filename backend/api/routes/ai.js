import express from 'express';
import { analyzeGrievance, detectDuplicates } from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/ai/analyze
 * Analyzes images and returns AI suggestions for CAMPUS grievances
 * Body: { title?: string, description?: string, images: string[] }
 * Returns: { isProblemRelated, suggestedTitle, suggestedDescription, suggestedDepartments, suggestedPriority, confidence, reasoning }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { title = '', description = '', images = [] } = req.body;

    // Images are optional - AI can analyze from title and description alone
    // But if images are provided, they should be valid base64 strings
    if (images && images.length > 0) {
      // Validate base64 format
      const invalidImages = images.filter(img => {
        if (typeof img !== 'string') return true;
        // Remove data:image/... prefix if present
        const base64Data = img.includes(',') ? img.split(',')[1] : img;
        // Check if it's valid base64
        return !/^[A-Za-z0-9+/=]+$/.test(base64Data);
      });

      if (invalidImages.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid image format. Images must be base64 encoded strings.'
        });
      }
    }

    console.log('🔍 [API] AI Analysis request for CAMPUS:', {
      title: title || '(empty)',
      description: description || '(empty)',
      imageCount: images.length
    });

    const startTime = Date.now();
    const analysis = await analyzeGrievance(title, description, images);
    const duration = Date.now() - startTime;

    console.log(`✅ [API] AI Analysis completed in ${duration}ms`);

    res.json({
      success: true,
      data: analysis,
      processingTime: duration
    });
  } catch (error) {
    console.error('❌ [API] AI Analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'AI analysis failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * POST /api/ai/analyze-priority
 * Analyzes priority only (legacy endpoint)
 */
router.post('/analyze-priority', async (req, res) => {
  try {
    const { title, description, images = [] } = req.body;

    const { analyzePriority } = await import('../services/aiService.js');
    const priority = await analyzePriority(title || '', description || '', images);

    res.json({
      success: true,
      priority: priority,
      confidence: 0.8 // Default confidence for priority-only analysis
    });
  } catch (error) {
    console.error('❌ [API] Priority analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Priority analysis failed'
    });
  }
});

/**
 * POST /api/ai/check-duplicates
 * Check for duplicate/similar grievances
 * Body: { title, description, images?, latitude?, longitude?, existingGrievances }
 * Returns: { hasDuplicates, similarGrievances[], confidence }
 */
router.post('/check-duplicates', async (req, res) => {
  try {
    const { title, description, images = [], latitude, longitude, existingGrievances = [] } = req.body;

    if (!title && !description) {
      return res.status(400).json({
        success: false,
        message: 'Title or description is required'
      });
    }

    console.log('🔍 [API] Duplicate check request:', {
      title: title || '(empty)',
      description: description || '(empty)',
      imageCount: images.length,
      existingCount: existingGrievances.length
    });

    const startTime = Date.now();
    const result = await detectDuplicates(
      title || '',
      description || '',
      images,
      existingGrievances,
      latitude,
      longitude
    );
    const duration = Date.now() - startTime;

    console.log(`✅ [API] Duplicate check completed in ${duration}ms`);
    console.log(`   Found ${result.similarGrievances.length} similar grievances`);

    res.json({
      success: true,
      data: result,
      processingTime: duration
    });
  } catch (error) {
    console.error('❌ [API] Duplicate check error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Duplicate detection failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

