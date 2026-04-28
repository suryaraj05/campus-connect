import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
dotenv.config({ path: join(__dirname, '..', '.env') });

// Test locations around a campus (adjust coordinates to your campus)
const testLocations = [
  { name: 'Main Library', description: 'Central library building', latitude: 18.883747, longitude: 77.920214, category: 'academic' },
  { name: 'Student Center', description: 'Main student activity center', latitude: 18.884500, longitude: 77.921000, category: 'facility' },
  { name: 'Science Building', description: 'Science and engineering building', latitude: 18.883000, longitude: 77.919500, category: 'academic' },
  { name: 'Cafeteria', description: 'Main dining hall', latitude: 18.884200, longitude: 77.920500, category: 'facility' },
  { name: 'Sports Complex', description: 'Gymnasium and sports facilities', latitude: 18.885000, longitude: 77.921500, category: 'recreation' },
  { name: 'Administration Building', description: 'Main administrative offices', latitude: 18.883500, longitude: 77.920000, category: 'administrative' },
  { name: 'Parking Lot A', description: 'Main parking area', latitude: 18.882500, longitude: 77.919000, category: 'parking' },
  { name: 'Dormitory Block 1', description: 'Student residence hall', latitude: 18.885500, longitude: 77.922000, category: 'residential' },
  { name: 'Computer Lab', description: 'Computer science laboratory', latitude: 18.883200, longitude: 77.919800, category: 'academic' },
  { name: 'Medical Center', description: 'Campus health center', latitude: 18.884800, longitude: 77.920800, category: 'health' },
  { name: 'Auditorium', description: 'Main auditorium and event hall', latitude: 18.884000, longitude: 77.920200, category: 'facility' },
  { name: 'Garden Area', description: 'Campus garden and green space', latitude: 18.883800, longitude: 77.920600, category: 'recreation' },
];

async function addTestLocations() {
  try {
    // Import Firebase service
    const { locationService } = await import('../api/services/firebaseService.js');
    
    console.log('📍 Adding test locations...');
    
    for (const location of testLocations) {
      try {
        const result = await locationService.create(location);
        console.log(`✅ Added: ${location.name} (ID: ${result.id})`);
      } catch (error) {
        console.error(`❌ Failed to add ${location.name}:`, error.message);
      }
    }
    
    console.log('✅ Test locations added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding test locations:', error);
    process.exit(1);
  }
}

addTestLocations();

