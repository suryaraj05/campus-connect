import { GoogleGenerativeAI } from '@google/generative-ai';
import { DEPARTMENTS, PRIORITY_LEVELS } from '../config/departments.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly (in case it wasn't loaded in index.js)
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// Get API key and trim whitespace
const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
  console.warn('💡 Make sure .env file is in backend/ folder with GEMINI_API_KEY');
  console.warn('🔍 Current env check:', {
    hasKey: !!process.env.GEMINI_API_KEY,
    keyLength: process.env.GEMINI_API_KEY?.length || 0,
    keyPreview: process.env.GEMINI_API_KEY?.substring(0, 10) || 'none'
  });
} else {
  console.log('✅ GEMINI_API_KEY loaded successfully');
}

/**
 * Comprehensive AI analysis of images, title, and description to classify the grievance.
 * This function determines if the issue is problem-related, suggests departments, and priority.
 * Adapted for CAMPUS context (not village).
 * 
 * @param {string} title - Grievance title
 * @param {string} description - Grievance description
 * @param {string[]} images - Array of base64 encoded images
 * @returns {Promise<Object>} AI analysis result with suggested fields
 */
export const analyzeGrievance = async (
  title = '',
  description = '',
  images = []
) => {
  // Re-check API key (in case env wasn't loaded)
  const currentApiKey = process.env.GEMINI_API_KEY?.trim() || apiKey;
  
  if (!currentApiKey) {
    console.error('❌ GEMINI_API_KEY is missing!');
    console.error('💡 Check:');
    console.error('   1. .env file exists in backend/ folder');
    console.error('   2. GEMINI_API_KEY=your_key_here is in .env');
    console.error('   3. No quotes around the key value');
    console.error('   4. Server was restarted after adding key');
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file in the backend/ folder.');
  }

  try {
    console.log('🔍 [AI Analysis] Starting grievance analysis for CAMPUS...');
    console.log('🔍 [AI Analysis] Input - Title:', title || '(empty)', 'Description:', description || '(empty)', 'Images:', images.length);
    
    const currentApiKey = process.env.GEMINI_API_KEY?.trim() || apiKey;
    const genAI = new GoogleGenerativeAI(currentApiKey);
    // Use gemini-2.5-flash (current stable model)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });
    console.log('🔍 [AI Analysis] Using model: gemini-2.5-flash (stable)');
    
    console.log('🔍 [AI Analysis] Model initialized, preparing prompt...');

    const prompt = `
You are an AI assistant for a CAMPUS grievance reporting system. Analyze the provided grievance information (title, description, and images) and provide a comprehensive classification.

CONTEXT: This is a CAMPUS environment with:
- 9000+ students, 100+ faculty
- Hostels (boys and girls), Mess halls, Hospital, Bank, ATMs
- Academic buildings, Sports facilities, Laundry, Coffee shops
- Roads, pathways, water supply, electrical systems, waste management

Available departments (infrastructure/maintenance, NOT academic departments):
- "Municipal Cleanliness" (garbage, waste, cleaning issues, campus cleanliness)
- "Electrical Department" (power outages, electrical hazards, street lights, building electrical issues)
- "Water Department" (water supply, leaks, drainage, flooding, water quality issues)
- "Roads & Infrastructure" (potholes, road damage, pathways, sidewalks, building infrastructure)
- "Health & Sanitation" (public health issues, sanitation problems, medical emergencies, hygiene concerns)

Priority levels:
- "low": Minor cosmetic issues, non-urgent maintenance (e.g., peeling paint, overgrown grass, minor cleaning)
- "medium": Standard issues needing attention but not immediate hazards (e.g., street light out, missed garbage collection, minor water leak)
- "high": Significant issues affecting quality of life or potential safety risks (e.g., large pothole, broken water pipe, electrical issue in building)
- "urgent": Immediate threats to life, safety, or critical infrastructure (e.g., live wire exposed, major flooding, gas leak, fire, medical emergency)

Analyze the following:
Title: "${title}"
Description: "${description}"

Return a JSON object with this exact structure:
{
  "isProblemRelated": boolean (true if this is a legitimate campus infrastructure/maintenance problem, false if unrelated/spam),
  "suggestedTitle": "A concise, descriptive title for this grievance (max 100 characters)",
  "suggestedDescription": "A detailed description of the issue visible in the images (max 1000 characters)",
  "suggestedDepartments": ["Department1", "Department2"] (array of department names from the list above),
  "suggestedPriority": "low" | "medium" | "high" | "urgent",
  "suggestedLocation": "Optional: Location description if visible in images (e.g., 'Hostel Block A, Floor 2', 'Near Mess Hall 1', 'Academic Building 3'), or empty string",
  "confidence": 0.0 to 1.0 (confidence score of the analysis),
  "reasoning": "Brief explanation of why these classifications were made"
}

Important:
- If images show unrelated content (selfies, random photos, memes, academic content), set isProblemRelated to false
- If images show a legitimate campus infrastructure/maintenance issue, set isProblemRelated to true
- Suggest all relevant departments (can be multiple)
- Base priority on severity visible in images and described in text
- Be conservative with "urgent" - only use for life-threatening situations
- Consider campus context (hostels, mess, facilities, etc.) when suggesting location
`;

    const imageParts = images.map(img => {
      // Handle base64 strings (with or without data:image prefix)
      let imageData = img;
      if (img.includes(',')) {
        imageData = img.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      }
      
      return {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      };
    });

    console.log('🔍 [AI Analysis] Sending request to Gemini API with', imageParts.length, 'image(s)...');
    const startTime = Date.now();
    
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().trim();
    
    const duration = Date.now() - startTime;
    console.log(`✅ [AI Analysis] API response received in ${duration}ms`);
    console.log('🔍 [AI Analysis] Raw response:', text.substring(0, 200) + '...');
    
    // Parse JSON response
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.warn('Failed to parse AI response as JSON:', text);
      analysis = {
        isProblemRelated: true,
        suggestedTitle: 'Campus Issue Report',
        suggestedDescription: 'Please describe the issue you observed on campus.',
        suggestedDepartments: [],
        suggestedPriority: 'medium',
        suggestedLocation: '',
        confidence: 0.5,
        reasoning: 'AI analysis returned unexpected format'
      };
    }

    // Validate and sanitize the response
    const validDepartments = DEPARTMENTS;
    const validPriorities = PRIORITY_LEVELS;

    // Filter out invalid departments
    analysis.suggestedDepartments = analysis.suggestedDepartments?.filter(
      (dept) => validDepartments.includes(dept)
    ) || [];

    // Ensure at least one department if problem is related
    if (analysis.isProblemRelated && analysis.suggestedDepartments.length === 0) {
      analysis.suggestedDepartments = ['Municipal Cleanliness']; // Default fallback
    }

    // Ensure title and description exist
    if (!analysis.suggestedTitle || analysis.suggestedTitle.trim() === '') {
      analysis.suggestedTitle = 'Campus Issue Report';
    }
    if (!analysis.suggestedDescription || analysis.suggestedDescription.trim() === '') {
      analysis.suggestedDescription = 'Issue observed on campus in the uploaded images.';
    }

    // Validate priority
    if (!validPriorities.includes(analysis.suggestedPriority)) {
      analysis.suggestedPriority = 'medium';
    }

    // Ensure confidence is between 0 and 1
    analysis.confidence = Math.max(0, Math.min(1, analysis.confidence || 0.5));

    // Ensure location is a string
    if (!analysis.suggestedLocation) {
      analysis.suggestedLocation = '';
    }

    console.log('✅ [AI Analysis] Analysis complete:', {
      isProblemRelated: analysis.isProblemRelated,
      departments: analysis.suggestedDepartments,
      priority: analysis.suggestedPriority,
      confidence: analysis.confidence
    });

    return analysis;
  } catch (error) {
    console.error('❌ [AI Analysis] Error analyzing grievance with Gemini:', error);
    if (error instanceof Error) {
      console.error('❌ [AI Analysis] Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 500)
      });
    }
    throw error;
  }
};

/**
 * Analyzes the priority of a grievance based on its title, description, and optional images.
 * @param title The title of the grievance
 * @param description The detailed description of the grievance
 * @param images Optional array of base64 encoded image strings
 * @returns A Promise resolving to a Priority ('low' | 'medium' | 'high' | 'urgent')
 */
export const analyzePriority = async (title, description, images = []) => {
  const currentApiKey = process.env.GEMINI_API_KEY?.trim() || apiKey;
  
  if (!currentApiKey) {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.');
  }

  try {
    const genAI = new GoogleGenerativeAI(currentApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an AI assistant for a CAMPUS grievance reporting system.
Your task is to analyze a grievance based on its title, description, and attached images (if any) and assign a priority level.

CONTEXT: This is a CAMPUS environment with hostels, mess halls, academic buildings, facilities, etc.

The available priority levels are:
- low: Minor cosmetic issues, non-urgent maintenance (e.g., peeling paint, overgrown grass in park).
- medium: Standard issues that need attention but aren't immediate hazards (e.g., street light out, garbage collection missed).
- high: Significant issues affecting quality of life or potential safety risks (e.g., large pothole, broken water pipe).
- urgent: Immediate threats to life, safety, or critical infrastructure (e.g., live wire exposed, major flooding, gas leak, fire).

Consider visual evidence from images if provided. For example, a "pothole" that looks like a small crack is low/medium, but a massive crater is high/urgent.

Analyze the following grievance:
Title: "${title}"
Description: "${description}"

Return ONLY the priority level as a single lowercase word: "low", "medium", "high", or "urgent". Do not include any other text or punctuation.
`;

    const imageParts = images.map(img => {
      let imageData = img;
      if (img.includes(',')) {
        imageData = img.split(',')[1];
      }
      return {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      };
    });

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    // Validate to ensure we return a valid Priority
    const validPriorities = PRIORITY_LEVELS;

    if (validPriorities.includes(text)) {
      return text;
    } else {
      // Fallback if the model returns something unexpected
      console.warn('AI returned unexpected priority:', text);
      return 'medium';
    }
  } catch (error) {
    console.error('Error analyzing priority with Gemini:', error);
    throw error;
  }
};

/**
 * Check for duplicate grievances using AI
 * Compares a new grievance with existing ones to find similar issues
 * @param {string} title - New grievance title
 * @param {string} description - New grievance description
 * @param {string[]} images - New grievance images (base64)
 * @param {Array} existingGrievances - Array of existing grievances to compare against
 * @param {number} latitude - New grievance latitude
 * @param {number} longitude - New grievance longitude
 * @returns {Promise<Object>} Duplicate detection result with similar grievances
 */
export const detectDuplicates = async (
  title = '',
  description = '',
  images = [],
  existingGrievances = [],
  latitude = null,
  longitude = null
) => {
  const currentApiKey = process.env.GEMINI_API_KEY?.trim() || apiKey;
  
  if (!currentApiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  if (!existingGrievances || existingGrievances.length === 0) {
    return {
      hasDuplicates: false,
      similarGrievances: [],
      confidence: 0
    };
  }

  try {
    console.log('🔍 [Duplicate Detection] Checking for duplicates...');
    console.log(`🔍 [Duplicate Detection] Comparing against ${existingGrievances.length} existing grievances`);

    const genAI = new GoogleGenerativeAI(currentApiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    // Prepare existing grievances summary
    const existingSummary = existingGrievances.map((g, index) => ({
      id: g.grievanceId || g.id || index,
      title: g.title || '',
      description: g.description || '',
      status: g.status || 'unknown',
      location: g.location || '',
      latitude: g.latitude,
      longitude: g.longitude,
      createdAt: g.createdAt || null
    })).slice(0, 20); // Limit to 20 most recent for performance

    const prompt = `
You are an AI assistant for a campus grievance reporting system. Your task is to identify if a new grievance is a duplicate or very similar to existing grievances.

NEW GRIEVANCE:
Title: "${title}"
Description: "${description}"

EXISTING GRIEVANCES:
${JSON.stringify(existingSummary, null, 2)}

Analyze if the new grievance describes the SAME problem as any existing grievance. Consider:
1. Problem type (e.g., "pothole", "water leak", "broken light")
2. Location similarity (if locations are close, higher chance of duplicate)
3. Description similarity
4. Visual similarity (if images are provided)

Return a JSON object with this exact structure:
{
  "hasDuplicates": boolean (true if similar grievances found),
  "similarGrievances": [
    {
      "grievanceId": "id from existing grievances",
      "similarityScore": 0.0 to 1.0 (how similar, 1.0 = exact duplicate),
      "reason": "Why this is similar (e.g., 'Same pothole location', 'Same water leak issue')",
      "isSameLocation": boolean (true if locations are very close, within ~100m),
      "canRevive": boolean (true if existing grievance is resolved/closed but problem persists)
    }
  ],
  "confidence": 0.0 to 1.0 (overall confidence in duplicate detection)
}

Important:
- Only include grievances with similarityScore >= 0.7 (high similarity)
- Sort by similarityScore descending
- If hasDuplicates is false, return empty similarGrievances array
- Consider location: if coordinates are within ~100 meters, isSameLocation should be true
- canRevive should be true if status is "resolved" or "closed" but the problem seems to persist
`;

    const imageParts = images.slice(0, 1).map(img => {
      let imageData = img;
      if (img.includes(',')) {
        imageData = img.split(',')[1];
      }
      return {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      };
    });

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text().trim();

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.warn('Failed to parse duplicate detection response:', text);
      analysis = {
        hasDuplicates: false,
        similarGrievances: [],
        confidence: 0
      };
    }

    // Calculate distance for location-based matching
    if (latitude && longitude) {
      analysis.similarGrievances = analysis.similarGrievances.map(similar => {
        const existing = existingGrievances.find(g => 
          (g.grievanceId || g.id) === similar.grievanceId
        );
        
        if (existing && existing.latitude && existing.longitude) {
          const distance = calculateDistance(
            latitude, longitude,
            existing.latitude, existing.longitude
          );
          similar.distance = distance; // in meters
          similar.isSameLocation = distance < 100; // within 100m
        }
        
        return similar;
      });
    }

    // Filter to only high similarity matches
    analysis.similarGrievances = analysis.similarGrievances
      .filter(s => s.similarityScore >= 0.7)
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5); // Top 5 matches

    analysis.hasDuplicates = analysis.similarGrievances.length > 0;

    console.log(`✅ [Duplicate Detection] Found ${analysis.similarGrievances.length} similar grievances`);

    return analysis;
  } catch (error) {
    console.error('❌ [Duplicate Detection] Error:', error);
    // Return safe default on error
    return {
      hasDuplicates: false,
      similarGrievances: [],
      confidence: 0
    };
  }
};

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

