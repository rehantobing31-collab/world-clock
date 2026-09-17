// ============================================
// WORLD CLOCK — Data Kota + Koordinat
// ============================================

const CITIES = [
  // INDONESIA
  { id: 'jakarta', city: 'Jakarta', country: 'Indonesia (WIB)', tz: 'Asia/Jakarta', flag: '🇮🇩', region: 'Asia', lat: -6.2088, lon: 106.8456 },
  { id: 'makassar', city: 'Makassar', country: 'Indonesia (WITA)', tz: 'Asia/Makassar', flag: '🇮🇩', region: 'Asia', lat: -5.1477, lon: 119.4327 },
  { id: 'jayapura', city: 'Jayapura', country: 'Indonesia (WIT)', tz: 'Asia/Jayapura', flag: '🇮🇩', region: 'Asia', lat: -2.5916, lon: 140.6690 },

  // ASIA
  { id: 'singapore', city: 'Singapore', country: 'Singapura', tz: 'Asia/Singapore', flag: '🇸🇬', region: 'Asia', lat: 1.3521, lon: 103.8198 },
  { id: 'tokyo', city: 'Tokyo', country: 'Jepang', tz: 'Asia/Tokyo', flag: '🇯🇵', region: 'Asia', lat: 35.6762, lon: 139.6503 },
  { id: 'seoul', city: 'Seoul', country: 'Korea Selatan', tz: 'Asia/Seoul', flag: '🇰🇷', region: 'Asia', lat: 37.5665, lon: 126.9780 },
  { id: 'beijing', city: 'Beijing', country: 'China', tz: 'Asia/Shanghai', flag: '🇨🇳', region: 'Asia', lat: 39.9042, lon: 116.4074 },
  { id: 'hongkong', city: 'Hong Kong', country: 'China', tz: 'Asia/Hong_Kong', flag: '🇭🇰', region: 'Asia', lat: 22.3193, lon: 114.1694 },
  { id: 'bangkok', city: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok', flag: '🇹🇭', region: 'Asia', lat: 13.7563, lon: 100.5018 },
  { id: 'hanoi', city: 'Hanoi', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', region: 'Asia', lat: 21.0285, lon: 105.8542 },
  { id: 'kualalumpur', city: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur', flag: '🇲🇾', region: 'Asia', lat: 3.1390, lon: 101.6869 },
  { id: 'manila', city: 'Manila', country: 'Filipina', tz: 'Asia/Manila', flag: '🇵🇭', region: 'Asia', lat: 14.5995, lon: 120.9842 },
  { id: 'newdelhi', city: 'New Delhi', country: 'India', tz: 'Asia/Kolkata', flag: '🇮🇳', region: 'Asia', lat: 28.6139, lon: 77.2090 },
  { id: 'dhaka', city: 'Dhaka', country: 'Bangladesh', tz: 'Asia/Dhaka', flag: '🇧🇩', region: 'Asia', lat: 23.8103, lon: 90.4125 },
  { id: 'colombo', city: 'Colombo', country: 'Sri Lanka', tz: 'Asia/Colombo', flag: '🇱🇰', region: 'Asia', lat: 6.9271, lon: 79.8612 },
  { id: 'kathmandu', city: 'Kathmandu', country: 'Nepal', tz: 'Asia/Kathmandu', flag: '🇳🇵', region: 'Asia', lat: 27.7172, lon: 85.3240 },
  { id: 'dubai', city: 'Dubai', country: 'UAE', tz: 'Asia/Dubai', flag: '🇦🇪', region: 'Asia', lat: 25.2048, lon: 55.2708 },
  { id: 'riyadh', city: 'Riyadh', country: 'Arab Saudi', tz: 'Asia/Riyadh', flag: '🇸🇦', region: 'Asia', lat: 24.7136, lon: 46.6753 },
  { id: 'tehran', city: 'Tehran', country: 'Iran', tz: 'Asia/Tehran', flag: '🇮🇷', region: 'Asia', lat: 35.6892, lon: 51.3890 },

  // EROPA
  { id: 'london', city: 'London', country: 'Inggris', tz: 'Europe/London', flag: '🇬🇧', region: 'Europe', lat: 51.5074, lon: -0.1278 },
  { id: 'paris', city: 'Paris', country: 'Prancis', tz: 'Europe/Paris', flag: '🇫🇷', region: 'Europe', lat: 48.8566, lon: 2.3522 },
  { id: 'berlin', city: 'Berlin', country: 'Jerman', tz: 'Europe/Berlin', flag: '🇩🇪', region: 'Europe', lat: 52.5200, lon: 13.4050 },
  { id: 'madrid', city: 'Madrid', country: 'Spanyol', tz: 'Europe/Madrid', flag: '🇪🇸', region: 'Europe', lat: 40.4168, lon: -3.7038 },
  { id: 'rome', city: 'Rome', country: 'Italia', tz: 'Europe/Rome', flag: '🇮🇹', region: 'Europe', lat: 41.9028, lon: 12.4964 },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Belanda', tz: 'Europe/Amsterdam', flag: '🇳🇱', region: 'Europe', lat: 52.3676, lon: 4.9041 },
  { id: 'moscow', city: 'Moscow', country: 'Rusia', tz: 'Europe/Moscow', flag: '🇷🇺', region: 'Europe', lat: 55.7558, lon: 37.6173 },
  { id: 'istanbul', city: 'Istanbul', country: 'Turki', tz: 'Europe/Istanbul', flag: '🇹🇷', region: 'Europe', lat: 41.0082, lon: 28.9784 },
  { id: 'athens', city: 'Athens', country: 'Yunani', tz: 'Europe/Athens', flag: '🇬🇷', region: 'Europe', lat: 37.9838, lon: 23.7275 },
  { id: 'stockholm', city: 'Stockholm', country: 'Swedia', tz: 'Europe/Stockholm', flag: '🇸🇪', region: 'Europe', lat: 59.3293, lon: 18.0686 },
  { id: 'zurich', city: 'Zurich', country: 'Swiss', tz: 'Europe/Zurich', flag: '🇨🇭', region: 'Europe', lat: 47.3769, lon: 8.5417 },
  { id: 'lisbon', city: 'Lisbon', country: 'Portugal', tz: 'Europe/Lisbon', flag: '🇵🇹', region: 'Europe', lat: 38.7223, lon: -9.1393 },

  // AMERIKA
  { id: 'newyork', city: 'New York', country: 'USA (EST)', tz: 'America/New_York', flag: '🇺🇸', region: 'America', lat: 40.7128, lon: -74.0060 },
  { id: 'losangeles', city: 'Los Angeles', country: 'USA (PST)', tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'America', lat: 34.0522, lon: -118.2437 },
  { id: 'chicago', city: 'Chicago', country: 'USA (CST)', tz: 'America/Chicago', flag: '🇺🇸', region: 'America', lat: 41.8781, lon: -87.6298 },
  { id: 'denver', city: 'Denver', country: 'USA (MST)', tz: 'America/Denver', flag: '🇺🇸', region: 'America', lat: 39.7392, lon: -104.9903 },
  { id: 'toronto', city: 'Toronto', country: 'Kanada', tz: 'America/Toronto', flag: '🇨🇦', region: 'America', lat: 43.6532, lon: -79.3832 },
  { id: 'vancouver', city: 'Vancouver', country: 'Kanada', tz: 'America/Vancouver', flag: '🇨🇦', region: 'America', lat: 49.2827, lon: -123.1207 },
  { id: 'mexicocity', city: 'Mexico City', country: 'Meksiko', tz: 'America/Mexico_City', flag: '🇲🇽', region: 'America', lat: 19.4326, lon: -99.1332 },
  { id: 'saopaulo', city: 'São Paulo', country: 'Brasil', tz: 'America/Sao_Paulo', flag: '🇧🇷', region: 'America', lat: -23.5505, lon: -46.6333 },
  { id: 'buenosaires', city: 'Buenos Aires', country: 'Argentina', tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', region: 'America', lat: -34.6037, lon: -58.3816 },
  { id: 'lima', city: 'Lima', country: 'Peru', tz: 'America/Lima', flag: '🇵🇪', region: 'America', lat: -12.0464, lon: -77.0428 },
  { id: 'bogota', city: 'Bogotá', country: 'Kolombia', tz: 'America/Bogota', flag: '🇨🇴', region: 'America', lat: 4.7110, lon: -74.0721 },
  { id: 'santiago', city: 'Santiago', country: 'Chile', tz: 'America/Santiago', flag: '🇨🇱', region: 'America', lat: -33.4489, lon: -70.6693 },

  // OCEANIA
  { id: 'sydney', city: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', flag: '🇦🇺', region: 'Oceania', lat: -33.8688, lon: 151.2093 },
  { id: 'melbourne', city: 'Melbourne', country: 'Australia', tz: 'Australia/Melbourne', flag: '🇦🇺', region: 'Oceania', lat: -37.8136, lon: 144.9631 },
  { id: 'perth', city: 'Perth', country: 'Australia', tz: 'Australia/Perth', flag: '🇦🇺', region: 'Oceania', lat: -31.9505, lon: 115.8605 },
  { id: 'auckland', city: 'Auckland', country: 'Selandia Baru', tz: 'Pacific/Auckland', flag: '🇳🇿', region: 'Oceania', lat: -36.8485, lon: 174.7633 },
  { id: 'suva', city: 'Suva', country: 'Fiji', tz: 'Pacific/Fiji', flag: '🇫🇯', region: 'Oceania', lat: -18.1416, lon: 178.4419 },

  // AFRIKA
  { id: 'cairo', city: 'Cairo', country: 'Mesir', tz: 'Africa/Cairo', flag: '🇪🇬', region: 'Africa', lat: 30.0444, lon: 31.2357 },
  { id: 'johannesburg', city: 'Johannesburg', country: 'Afrika Selatan', tz: 'Africa/Johannesburg', flag: '🇿🇦', region: 'Africa', lat: -26.2041, lon: 28.0473 },
  { id: 'lagos', city: 'Lagos', country: 'Nigeria', tz: 'Africa/Lagos', flag: '🇳🇬', region: 'Africa', lat: 6.5244, lon: 3.3792 },
  { id: 'nairobi', city: 'Nairobi', country: 'Kenya', tz: 'Africa/Nairobi', flag: '🇰🇪', region: 'Africa', lat: -1.2921, lon: 36.8219 },
  { id: 'casablanca', city: 'Casablanca', country: 'Maroko', tz: 'Africa/Casablanca', flag: '🇲🇦', region: 'Africa', lat: 33.5731, lon: -7.5898 },
  { id: 'addisababa', city: 'Addis Ababa', country: 'Ethiopia', tz: 'Africa/Addis_Ababa', flag: '🇪🇹', region: 'Africa', lat: 9.0300, lon: 38.7400 },
];

const TZ_ALIASES = {
  'wib':   'Asia/Jakarta',
  'wita':  'Asia/Makassar',
  'wit':   'Asia/Jayapura',
  'utc':   'UTC',
  'gmt':   'UTC',
  'est':   'America/New_York',
  'pst':   'America/Los_Angeles',
  'cst':   'America/Chicago',
  'mst':   'America/Denver',
  'cet':   'Europe/Paris',
  'jst':   'Asia/Tokyo',
  'kst':   'Asia/Seoul',
  'sgt':   'Asia/Singapore',
  'ist':   'Asia/Kolkata',
  'aest':  'Australia/Sydney',
};

const CITY_NAME_TO_TZ = CITIES.reduce((acc, c) => {
  acc[c.city.toLowerCase()] = c.tz;
  acc[c.id.toLowerCase()] = c.tz;
  return acc;
}, {});
