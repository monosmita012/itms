// Comprehensive Indian Railway Station Dataset
// This dataset contains major railway stations with their coordinates and details

export interface StationData {
  code: string;
  name: string;
  lat: number;
  lng: number;
  state: string;
  zone: string;
  category: 'A1' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

export const indianStations: StationData[] = [
  // Major A1 Category Stations (Metro Cities)
  { code: 'NDLS', name: 'New Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi', zone: 'NR', category: 'A1' },
  { code: 'MMCT', name: 'Mumbai Central', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', zone: 'WR', category: 'A1' },
  { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', zone: 'SR', category: 'A1' },
  { code: 'HWH', name: 'Howrah', lat: 22.5726, lng: 88.3639, state: 'West Bengal', zone: 'ER', category: 'A1' },
  { code: 'SBC', name: 'Bangalore City', lat: 12.9716, lng: 77.5946, state: 'Karnataka', zone: 'SWR', category: 'A1' },
  { code: 'SC', name: 'Secunderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana', zone: 'SCR', category: 'A1' },
  { code: 'ADI', name: 'Ahmedabad Junction', lat: 23.0225, lng: 72.5714, state: 'Gujarat', zone: 'WR', category: 'A1' },
  { code: 'PUNE', name: 'Pune Junction', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', zone: 'CR', category: 'A1' },

  // Major A Category Stations
  { code: 'CNB', name: 'Kanpur Central', lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },
  { code: 'LKO', name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },
  { code: 'JP', name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', zone: 'NWR', category: 'A' },
  { code: 'BPL', name: 'Bhopal Junction', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'BRC', name: 'Vadodara Junction', lat: 22.3072, lng: 73.1812, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'NGP', name: 'Nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra', zone: 'CR', category: 'A' },
  { code: 'JBP', name: 'Jabalpur', lat: 23.1815, lng: 79.9864, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'GZB', name: 'Ghaziabad', lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },
  { code: 'AGC', name: 'Agra Cantt', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },
  { code: 'MTJ', name: 'Mathura Junction', lat: 27.4924, lng: 77.6737, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },

  // South India Major Stations
  { code: 'TVC', name: 'Trivandrum Central', lat: 8.5241, lng: 76.9366, state: 'Kerala', zone: 'SR', category: 'A' },
  { code: 'CLT', name: 'Kozhikode', lat: 11.2588, lng: 75.7804, state: 'Kerala', zone: 'SR', category: 'A' },
  { code: 'MAQ', name: 'Mangalore Central', lat: 12.8644, lng: 74.8420, state: 'Karnataka', zone: 'SWR', category: 'A' },
  { code: 'MYS', name: 'Mysore Junction', lat: 12.2958, lng: 76.6394, state: 'Karnataka', zone: 'SWR', category: 'A' },
  { code: 'HUB', name: 'Hubballi Junction', lat: 15.3647, lng: 75.1240, state: 'Karnataka', zone: 'SWR', category: 'A' },
  { code: 'GTL', name: 'Guntakal Junction', lat: 15.1700, lng: 77.3600, state: 'Andhra Pradesh', zone: 'SCR', category: 'A' },
  { code: 'GNT', name: 'Guntur Junction', lat: 16.3069, lng: 80.4365, state: 'Andhra Pradesh', zone: 'SCR', category: 'A' },
  { code: 'BZA', name: 'Vijayawada Junction', lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh', zone: 'SCR', category: 'A' },
  { code: 'TPTY', name: 'Tirupati', lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh', zone: 'SCR', category: 'A' },
  { code: 'RU', name: 'Renigunta Junction', lat: 13.6500, lng: 79.5167, state: 'Andhra Pradesh', zone: 'SCR', category: 'A' },

  // East India Major Stations
  { code: 'ASN', name: 'Asansol Junction', lat: 23.6739, lng: 86.9524, state: 'West Bengal', zone: 'ER', category: 'A' },
  { code: 'DGR', name: 'Durgapur', lat: 23.5000, lng: 87.3200, state: 'West Bengal', zone: 'ER', category: 'A' },
  { code: 'BWN', name: 'Barddhaman Junction', lat: 23.2400, lng: 87.8600, state: 'West Bengal', zone: 'ER', category: 'A' },
  { code: 'KGP', name: 'Kharagpur Junction', lat: 22.3149, lng: 87.3105, state: 'West Bengal', zone: 'SER', category: 'A' },
  { code: 'TATA', name: 'Tatanagar Junction', lat: 22.7800, lng: 86.2000, state: 'Jharkhand', zone: 'SER', category: 'A' },
  { code: 'RNC', name: 'Ranchi', lat: 23.3441, lng: 85.3096, state: 'Jharkhand', zone: 'SER', category: 'A' },
  { code: 'HTE', name: 'Hatia', lat: 23.3000, lng: 85.3000, state: 'Jharkhand', zone: 'SER', category: 'A' },
  { code: 'GMO', name: 'Gomoh Junction', lat: 23.8700, lng: 86.1500, state: 'Jharkhand', zone: 'ECR', category: 'A' },
  { code: 'GAY', name: 'Gaya Junction', lat: 24.7800, lng: 85.0000, state: 'Bihar', zone: 'ECR', category: 'A' },
  { code: 'PNBE', name: 'Patna Junction', lat: 25.5941, lng: 85.1376, state: 'Bihar', zone: 'ECR', category: 'A' },

  // North India Major Stations
  { code: 'AMR', name: 'Amritsar Junction', lat: 31.6340, lng: 74.8723, state: 'Punjab', zone: 'NR', category: 'A' },
  { code: 'LDH', name: 'Ludhiana Junction', lat: 30.9010, lng: 75.8573, state: 'Punjab', zone: 'NR', category: 'A' },
  { code: 'ASR', name: 'Amritsar', lat: 31.6340, lng: 74.8723, state: 'Punjab', zone: 'NR', category: 'A' },
  { code: 'JRC', name: 'Jalandhar City', lat: 31.3260, lng: 75.5762, state: 'Punjab', zone: 'NR', category: 'A' },
  { code: 'PTA', name: 'Pathankot', lat: 32.2748, lng: 75.6527, state: 'Punjab', zone: 'NR', category: 'A' },
  { code: 'UNA', name: 'Una Himachal', lat: 31.4659, lng: 76.2692, state: 'Himachal Pradesh', zone: 'NR', category: 'A' },
  { code: 'KALKA', name: 'Kalka', lat: 30.8393, lng: 76.9253, state: 'Haryana', zone: 'NR', category: 'A' },
  { code: 'UMB', name: 'Ambala Cantt', lat: 30.3753, lng: 76.7821, state: 'Haryana', zone: 'NR', category: 'A' },
  { code: 'KUN', name: 'Kurukshetra Junction', lat: 29.9695, lng: 76.8783, state: 'Haryana', zone: 'NR', category: 'A' },
  { code: 'PNP', name: 'Panipat Junction', lat: 29.3909, lng: 76.9635, state: 'Haryana', zone: 'NR', category: 'A' },

  // West India Major Stations
  { code: 'RTM', name: 'Ratlam Junction', lat: 23.3315, lng: 75.0367, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'UJN', name: 'Ujjain Junction', lat: 23.1765, lng: 75.7885, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'INDB', name: 'Indore Junction', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'DHD', name: 'Dahod', lat: 22.8312, lng: 74.2519, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'GIMB', name: 'Gandhidham Junction', lat: 23.0833, lng: 70.1333, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'BVI', name: 'Borivali', lat: 19.2307, lng: 72.8567, state: 'Maharashtra', zone: 'WR', category: 'A' },
  { code: 'DR', name: 'Dadar', lat: 19.0176, lng: 72.8562, state: 'Maharashtra', zone: 'WR', category: 'A' },
  { code: 'KYN', name: 'Kalyan Junction', lat: 19.2433, lng: 73.1358, state: 'Maharashtra', zone: 'CR', category: 'A' },
  { code: 'IGP', name: 'Igatpuri', lat: 19.7000, lng: 73.5500, state: 'Maharashtra', zone: 'CR', category: 'A' },
  { code: 'NK', name: 'Nashik Road', lat: 20.0059, lng: 73.7784, state: 'Maharashtra', zone: 'CR', category: 'A' },

  // Central India Major Stations
  { code: 'ET', name: 'Itarsi Junction', lat: 22.6140, lng: 77.7510, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'KTE', name: 'Katni Junction', lat: 23.8300, lng: 80.4000, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'SGO', name: 'Saugar', lat: 23.8300, lng: 78.7200, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'BINA', name: 'Bina Junction', lat: 24.2000, lng: 78.2000, state: 'Madhya Pradesh', zone: 'WCR', category: 'A' },
  { code: 'LAR', name: 'Lalitpur', lat: 24.6900, lng: 78.4100, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },
  { code: 'JHS', name: 'Jhansi Junction', lat: 25.4484, lng: 78.5685, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },
  { code: 'ORAI', name: 'Orai', lat: 26.0200, lng: 79.4700, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },
  { code: 'ETW', name: 'Etawah', lat: 26.7700, lng: 79.0200, state: 'Uttar Pradesh', zone: 'NCR', category: 'A' },
  { code: 'FBD', name: 'Faridabad', lat: 28.4089, lng: 77.3178, state: 'Haryana', zone: 'NCR', category: 'A' },
  { code: 'PNP', name: 'Panipat Junction', lat: 29.3909, lng: 76.9635, state: 'Haryana', zone: 'NR', category: 'A' },

  // Additional Important Stations
  { code: 'RNC', name: 'Ranchi', lat: 23.3441, lng: 85.3096, state: 'Jharkhand', zone: 'SER', category: 'A' },
  { code: 'BSP', name: 'Bilaspur Junction', lat: 22.0800, lng: 82.1500, state: 'Chhattisgarh', zone: 'SECR', category: 'A' },
  { code: 'R', name: 'Raipur Junction', lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh', zone: 'SECR', category: 'A' },
  { code: 'DURG', name: 'Durg Junction', lat: 21.1900, lng: 81.2800, state: 'Chhattisgarh', zone: 'SECR', category: 'A' },
  { code: 'G', name: 'Gondia Junction', lat: 21.4600, lng: 80.1900, state: 'Maharashtra', zone: 'SECR', category: 'A' },
  { code: 'BSL', name: 'Bhusawal Junction', lat: 21.0400, lng: 75.7800, state: 'Maharashtra', zone: 'CR', category: 'A' },
  { code: 'AK', name: 'Akola Junction', lat: 20.7000, lng: 77.0000, state: 'Maharashtra', zone: 'CR', category: 'A' },
  { code: 'BDTS', name: 'Bandra Terminus', lat: 19.0544, lng: 72.8406, state: 'Maharashtra', zone: 'WR', category: 'A' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', lat: 19.1972, lng: 72.8636, state: 'Maharashtra', zone: 'CR', category: 'A' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', lat: 18.9398, lng: 72.8355, state: 'Maharashtra', zone: 'CR', category: 'A' },

  // More stations for better coverage
  { code: 'TNA', name: 'Thane', lat: 19.2183, lng: 72.9781, state: 'Maharashtra', zone: 'CR', category: 'A' },
  { code: 'BSR', name: 'Vasai Road', lat: 19.4700, lng: 72.8000, state: 'Maharashtra', zone: 'WR', category: 'A' },
  { code: 'VAPI', name: 'Vapi', lat: 20.3715, lng: 72.9047, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'VLS', name: 'Valsad', lat: 20.6100, lng: 72.9300, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'BL', name: 'Valsad', lat: 20.6100, lng: 72.9300, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'ST', name: 'Surat', lat: 21.1702, lng: 72.8311, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'BH', name: 'Bharuch Junction', lat: 21.7000, lng: 72.9800, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'ANND', name: 'Anand Junction', lat: 22.5600, lng: 72.9600, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'ND', name: 'Nadiad Junction', lat: 22.6900, lng: 72.8700, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'MHD', name: 'Mahemdavad Kheda Road', lat: 22.8200, lng: 72.7500, state: 'Gujarat', zone: 'WR', category: 'A' },

  // Additional stations for comprehensive coverage
  { code: 'GIMB', name: 'Gandhidham Junction', lat: 23.0833, lng: 70.1333, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'BHUJ', name: 'Bhuj', lat: 23.2500, lng: 69.6700, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'PBR', name: 'Palanpur Junction', lat: 24.1700, lng: 72.4300, state: 'Gujarat', zone: 'WR', category: 'A' },
  { code: 'ABR', name: 'Abu Road', lat: 24.4800, lng: 72.7800, state: 'Rajasthan', zone: 'NWR', category: 'A' },
  { code: 'FA', name: 'Falna', lat: 25.7700, lng: 73.3300, state: 'Rajasthan', zone: 'NWR', category: 'A' },
  { code: 'MJ', name: 'Marwar Junction', lat: 25.8300, lng: 73.5000, state: 'Rajasthan', zone: 'NWR', category: 'A' },
  { code: 'BI', name: 'Beawar', lat: 26.1000, lng: 74.3200, state: 'Rajasthan', zone: 'NWR', category: 'A' },
  { code: 'AII', name: 'Ajmer Junction', lat: 26.4499, lng: 74.6399, state: 'Rajasthan', zone: 'NWR', category: 'A' },
  { code: 'KOTA', name: 'Kota Junction', lat: 25.2138, lng: 75.8648, state: 'Rajasthan', zone: 'WCR', category: 'A' },
  { code: 'SWM', name: 'Sawai Madhopur', lat: 26.0200, lng: 76.3500, state: 'Rajasthan', zone: 'WCR', category: 'A' }
];

/**
 * Find station by code
 */
export function findStationByCode(code: string): StationData | undefined {
  return indianStations.find(station => 
    station.code.toLowerCase() === code.toLowerCase()
  );
}

/**
 * Find station by name (partial match)
 */
export function findStationByName(name: string): StationData | undefined {
  return indianStations.find(station => 
    station.name.toLowerCase().includes(name.toLowerCase())
  );
}

/**
 * Get all stations in a state
 */
export function getStationsByState(state: string): StationData[] {
  return indianStations.filter(station => 
    station.state.toLowerCase() === state.toLowerCase()
  );
}

/**
 * Get all stations in a zone
 */
export function getStationsByZone(zone: string): StationData[] {
  return indianStations.filter(station => 
    station.zone.toLowerCase() === zone.toLowerCase()
  );
}

/**
 * Search stations by query (code or name)
 */
export function searchStations(query: string): StationData[] {
  const lowerQuery = query.toLowerCase();
  return indianStations.filter(station => 
    station.code.toLowerCase().includes(lowerQuery) ||
    station.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get station coordinates by code
 */
export function getStationCoordinates(code: string): { lat: number; lng: number } | null {
  const station = findStationByCode(code);
  return station ? { lat: station.lat, lng: station.lng } : null;
}

export default indianStations;

