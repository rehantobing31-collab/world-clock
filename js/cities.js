// ============================================
// WORLD CLOCK — Data Kota & Timezone
// ============================================

const CITIES = [
  // ===== INDONESIA =====
  { id: 'jakarta',     city: 'Jakarta',      country: 'Indonesia (WIB)',  tz: 'Asia/Jakarta',     flag: '🇮🇩', region: 'Asia' },
  { id: 'makassar',    city: 'Makassar',     country: 'Indonesia (WITA)', tz: 'Asia/Makassar',    flag: '🇮🇩', region: 'Asia' },
  { id: 'jayapura',    city: 'Jayapura',     country: 'Indonesia (WIT)',  tz: 'Asia/Jayapura',    flag: '🇮🇩', region: 'Asia' },

  // ===== ASIA =====
  { id: 'singapore',   city: 'Singapore',    country: 'Singapura',        tz: 'Asia/Singapore',   flag: '🇸🇬', region: 'Asia' },
  { id: 'tokyo',       city: 'Tokyo',        country: 'Jepang',           tz: 'Asia/Tokyo',       flag: '🇯🇵', region: 'Asia' },
  { id: 'seoul',       city: 'Seoul',        country: 'Korea Selatan',    tz: 'Asia/Seoul',       flag: '🇰🇷', region: 'Asia' },
  { id: 'beijing',     city: 'Beijing',      country: 'China',            tz: 'Asia/Shanghai',    flag: '🇨🇳', region: 'Asia' },
  { id: 'hongkong',    city: 'Hong Kong',    country: 'China',            tz: 'Asia/Hong_Kong',   flag: '🇭🇰', region: 'Asia' },
  { id: 'bangkok',     city: 'Bangkok',      country: 'Thailand',         tz: 'Asia/Bangkok',     flag: '🇹🇭', region: 'Asia' },
  { id: 'hanoi',       city: 'Hanoi',        country: 'Vietnam',          tz: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', region: 'Asia' },
  { id: 'kualalumpur', city: 'Kuala Lumpur', country: 'Malaysia',         tz: 'Asia/Kuala_Lumpur',flag: '🇲🇾', region: 'Asia' },
  { id: 'manila',      city: 'Manila',       country: 'Filipina',         tz: 'Asia/Manila',      flag: '🇵🇭', region: 'Asia' },
  { id: 'newdelhi',    city: 'New Delhi',    country: 'India',            tz: 'Asia/Kolkata',     flag: '🇮🇳', region: 'Asia' },
  { id: 'dhaka',       city: 'Dhaka',        country: 'Bangladesh',       tz: 'Asia/Dhaka',       flag: '🇧🇩', region: 'Asia' },
  { id: 'colombo',     city: 'Colombo',      country: 'Sri Lanka',        tz: 'Asia/Colombo',     flag: '🇱🇰', region: 'Asia' },
  { id: 'kathmandu',   city: 'Kathmandu',    country: 'Nepal',            tz: 'Asia/Kathmandu',   flag: '🇳🇵', region: 'Asia' },
  { id: 'dubai',       city: 'Dubai',        country: 'UAE',              tz: 'Asia/Dubai',       flag: '🇦🇪', region: 'Asia' },
  { id: 'riyadh',      city: 'Riyadh',       country: 'Arab Saudi',       tz: 'Asia/Riyadh',      flag: '🇸🇦', region: 'Asia' },
  { id: 'tehran',      city: 'Tehran',       country: 'Iran',             tz: 'Asia/Tehran',      flag: '🇮🇷', region: 'Asia' },

  // ===== EROPA =====
  { id: 'london',      city: 'London',       country: 'Inggris',          tz: 'Europe/London',    flag: '🇬🇧', region: 'Europe' },
  { id: 'paris',       city: 'Paris',        country: 'Prancis',          tz: 'Europe/Paris',     flag: '🇫🇷', region: 'Europe' },
  { id: 'berlin',      city: 'Berlin',       country: 'Jerman',           tz: 'Europe/Berlin',    flag: '🇩🇪', region: 'Europe' },
  { id: 'madrid',      city: 'Madrid',       country: 'Spanyol',          tz: 'Europe/Madrid',    flag: '🇪🇸', region: 'Europe' },
  { id: 'rome',        city: 'Rome',         country: 'Italia',           tz: 'Europe/Rome',      flag: '🇮🇹', region: 'Europe' },
  { id: 'amsterdam',   city: 'Amsterdam',    country: 'Belanda',          tz: 'Europe/Amsterdam', flag: '🇳🇱', region: 'Europe' },
  { id: 'moscow',      city: 'Moscow',       country: 'Rusia',            tz: 'Europe/Moscow',    flag: '🇷🇺', region: 'Europe' },
  { id: 'istanbul',    city: 'Istanbul',     country: 'Turki',            tz: 'Europe/Istanbul',  flag: '🇹🇷', region: 'Europe' },
  { id: 'athens',      city: 'Athens',       country: 'Yunani',           tz: 'Europe/Athens',    flag: '🇬🇷', region: 'Europe' },
  { id: 'stockholm',   city: 'Stockholm',    country: 'Swedia',           tz: 'Europe/Stockholm', flag: '🇸🇪', region: 'Europe' },
  { id: 'zurich',      city: 'Zurich',       country: 'Swiss',            tz: 'Europe/Zurich',    flag: '🇨🇭', region: 'Europe' },
  { id: 'lisbon',      city: 'Lisbon',       country: 'Portugal',         tz: 'Europe/Lisbon',    flag: '🇵🇹', region: 'Europe' },

  // ===== AMERIKA =====
  { id: 'newyork',     city: 'New York',     country: 'USA (EST)',        tz: 'America/New_York',    flag: '🇺🇸', region: 'America' },
  { id: 'losangeles',  city: 'Los Angeles',  country: 'USA (PST)',        tz: 'America/Los_Angeles', flag: '🇺🇸', region: 'America' },
  { id: 'chicago',     city: 'Chicago',      country: 'USA (CST)',        tz: 'America/Chicago',     flag: '🇺🇸', region: 'America' },
  { id: 'denver',      city: 'Denver',       country: 'USA (MST)',        tz: 'America/Denver',      flag: '🇺🇸', region: 'America' },
  { id: 'toronto',     city: 'Toronto',      country: 'Kanada',           tz: 'America/Toronto',     flag: '🇨🇦', region: 'America' },
  { id: 'vancouver',   city: 'Vancouver',    country: 'Kanada',           tz: 'America/Vancouver',   flag: '🇨🇦', region: 'America' },
  { id: 'mexicocity',  city: 'Mexico City',  country: 'Meksiko',          tz: 'America/Mexico_City', flag: '🇲🇽', region: 'America' },
  { id: 'saopaulo',    city: 'São Paulo',    country: 'Brasil',           tz: 'America/Sao_Paulo',   flag: '🇧🇷', region: 'America' },
  { id: 'buenosaires', city: 'Buenos Aires', country: 'Argentina',        tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷', region: 'America' },
  { id: 'lima',        city: 'Lima',         country: 'Peru',             tz: 'America/Lima',        flag: '🇵🇪', region: 'America' },
  { id: 'bogota',      city: 'Bogotá',       country: 'Kolombia',         tz: 'America/Bogota',      flag: '🇨🇴', region: 'America' },
  { id: 'santiago',    city: 'Santiago',     country: 'Chile',            tz: 'America/Santiago',    flag: '🇨🇱', region: 'America' },

  // ===== OCEANIA =====
  { id: 'sydney',      city: 'Sydney',       country: 'Australia',        tz: 'Australia/Sydney',    flag: '🇦🇺', region: 'Oceania' },
  { id: 'melbourne',   city: 'Melbourne',    country: 'Australia',        tz: 'Australia/Melbourne', flag: '🇦🇺', region: 'Oceania' },
  { id: 'perth',       city: 'Perth',        country: 'Australia',        tz: 'Australia/Perth',     flag: '🇦🇺', region: 'Oceania' },
  { id: 'auckland',    city: 'Auckland',     country: 'Selandia Baru',    tz: 'Pacific/Auckland',    flag: '🇳🇿', region: 'Oceania' },
  { id: 'suva',        city: 'Suva',         country: 'Fiji',             tz: 'Pacific/Fiji',        flag: '🇫🇯', region: 'Oceania' },

  // ===== AFRIKA =====
  { id: 'cairo',       city: 'Cairo',        country: 'Mesir',            tz: 'Africa/Cairo',        flag: '🇪🇬', region: 'Africa' },
  { id: 'johannesburg',city: 'Johannesburg', country: 'Afrika Selatan',   tz: 'Africa/Johannesburg', flag: '🇿🇦', region: 'Africa' },
  { id: 'lagos',       city: 'Lagos',        country: 'Nigeria',          tz: 'Africa/Lagos',        flag: '🇳🇬', region: 'Africa' },
  { id: 'nairobi',     city: 'Nairobi',      country: 'Kenya',            tz: 'Africa/Nairobi',      flag: '🇰🇪', region: 'Africa' },
  { id: 'casablanca',  city: 'Casablanca',   country: 'Maroko',           tz: 'Africa/Casablanca',   flag: '🇲🇦', region: 'Africa' },
  { id: 'addisababa',  city: 'Addis Ababa',  country: 'Ethiopia',         tz: 'Africa/Addis_Ababa',  flag: '🇪🇹', region: 'Africa' },
];

// ============================================
// Alias timezone untuk fitur time travel
// ============================================
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

// ============================================
// Mapping nama kota -> timezone (auto-detect)
// ============================================
const CITY_NAME_TO_TZ = CITIES.reduce((acc, c) => {
  acc[c.city.toLowerCase()] = c.tz;
  acc[c.id.toLowerCase()] = c.tz;
  return acc;
}, {});
