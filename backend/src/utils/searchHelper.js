// Indian cities, districts, airport codes, colloquial terms, taluks and phonetic aliases
const CITY_ALIASES_MAP = {
  bangalore: {
    canonical: 'Bangalore',
    aliases: [
      'bangalore', 'bengaluru', 'blr', 'bengalooru', 'banglore', 'bengalur',
      'whitefield', 'koramangala', 'indiranagar', 'electronic city', 'jayanagar', 
      'malleshwaram', 'yelahanka', 'hebbal', 'marathahalli', 'silk board', 'btm'
    ]
  },
  tumkur: {
    canonical: 'Tumkur',
    aliases: [
      'tumkur', 'tumakuru', 'tmk', 'gubbi', 'sira', 'tiptur', 'kunigal', 'madhugiri',
      'pavagada', 'koratagere', 'turuvekere', 'chikkanayakanahalli', 'kyatsandra', 
      'siddaganga', 'sit tumkur', 'tumkure', 'tumkura', 'gubbi veeranna'
    ]
  },
  kolkata: {
    canonical: 'Kolkata',
    aliases: [
      'kolkata', 'calcutta', 'ccu', 'kolkathe', 'kokothe', 'kolkatta', 'kolkatha', 
      'kokata', 'howrah', 'salt lake', 'park street', 'esplanade', 'kolkatar'
    ]
  },
  mumbai: {
    canonical: 'Mumbai',
    aliases: [
      'mumbai', 'bombay', 'bom', 'mum', 'navi mumbai', 'thane', 'bandra', 'andheri', 
      'worli', 'juhu', 'powai', 'colaba', 'dadar', 'borivali'
    ]
  },
  delhi: {
    canonical: 'New Delhi',
    aliases: [
      'delhi', 'new delhi', 'del', 'dli', 'dilli', 'ncr', 'noida', 'gurgaon', 
      'gurugram', 'ghaziabad', 'faridabad', 'cp', 'connaught place', 'south delhi'
    ]
  },
  jaipur: {
    canonical: 'Jaipur',
    aliases: [
      'jaipur', 'jpr', 'jai', 'pink city', 'amer', 'chomu', 'mansarovar', 
      'vaishali nagar', 'rajasthan'
    ]
  },
  ahmedabad: {
    canonical: 'Ahmedabad',
    aliases: [
      'ahmedabad', 'amd', 'ahd', 'amdavad', 'ahmadabad', 'ahemdabad', 
      'gandhinagar', 'sg highway', 'bodakdev'
    ]
  },
  goa: {
    canonical: 'Goa',
    aliases: [
      'goa', 'goi', 'panaji', 'panjim', 'calangute', 'baga', 'anjuna', 
      'candolim', 'margao', 'vasco', 'vagator', 'north goa', 'south goa'
    ]
  },
  udaipur: {
    canonical: 'Udaipur',
    aliases: [
      'udaipur', 'udp', 'lake city', 'city of lakes', 'pichola', 'fateh sagar'
    ]
  },
  mathura: {
    canonical: 'Mathura',
    aliases: [
      'mathura', 'mat', 'vrindavan', 'braj', 'barsana', 'gokul', 'govardhan', 
      'krishna janmabhoomi'
    ]
  },
  mysore: {
    canonical: 'Mysore',
    aliases: [
      'mysore', 'mysuru', 'mys', 'myq', 'chamundi', 'heritage city'
    ]
  },
  mangalore: {
    canonical: 'Mangalore',
    aliases: [
      'mangalore', 'mangaluru', 'mlr', 'ixe', 'kudla', 'udupi'
    ]
  },
  hyderabad: {
    canonical: 'Hyderabad',
    aliases: [
      'hyderabad', 'hyd', 'secunderabad', 'cyberabad', 'hitec city', 
      'gachibowli', 'jubilee hills', 'banjara hills'
    ]
  },
  chennai: {
    canonical: 'Chennai',
    aliases: [
      'chennai', 'madras', 'maa', 'che', 'adyar', 'mylapore', 't nagar', 'velachery'
    ]
  },
  pune: {
    canonical: 'Pune',
    aliases: [
      'pune', 'pnq', 'pun', 'poona', 'hinjewadi', 'kothrud', 'viman nagar', 'baner'
    ]
  }
};

// Calculate Levenshtein distance between two strings
function levenshteinDistance(a = '', b = '') {
  const al = a.length;
  const bl = b.length;
  if (!al) return bl;
  if (!bl) return al;

  const dp = Array.from({ length: bl + 1 }, () => new Array(al + 1).fill(0));
  for (let i = 0; i <= bl; i++) dp[i][0] = i;
  for (let j = 0; j <= al; j++) dp[0][j] = j;

  for (let i = 1; i <= bl; i++) {
    for (let j = 1; j <= al; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1, // substitution
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return dp[bl][al];
}

// Calculate similarity ratio between 0.0 and 1.0
function stringSimilarity(s1 = '', s2 = '') {
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  if (a === b) return 1.0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshteinDistance(a, b);
  return (maxLen - dist) / maxLen;
}

// Normalizes city name to its canonical form
function normalizeCity(inputCity) {
  if (!inputCity) return '';
  const clean = inputCity.toLowerCase().trim();

  for (const key of Object.keys(CITY_ALIASES_MAP)) {
    const entry = CITY_ALIASES_MAP[key];
    if (clean === entry.canonical.toLowerCase() || entry.aliases.includes(clean)) {
      return entry.canonical;
    }
  }
  return inputCity.trim();
}

// Expands search query with resolved aliases, canonical cities, and fuzzy matches
function expandSearchQuery(query = '') {
  const rawClean = query.toLowerCase().trim();
  if (!rawClean) {
    return {
      originalQuery: '',
      tokens: [],
      matchedCities: [],
      expandedTerms: [],
      explanation: null
    };
  }

  // Split query into tokens
  const tokens = rawClean.split(/[\s,+/]+/).filter(Boolean);
  const matchedCities = new Set();
  const expandedTerms = new Set([rawClean, ...tokens]);
  const matchedAliasesInfo = [];

  // Check each token and full string against our aliases map
  const checkAgainstAliases = (term) => {
    // 1. Direct Alias Match
    for (const key of Object.keys(CITY_ALIASES_MAP)) {
      const entry = CITY_ALIASES_MAP[key];
      if (entry.aliases.includes(term) || entry.canonical.toLowerCase() === term) {
        matchedCities.add(entry.canonical);
        entry.aliases.forEach(a => expandedTerms.add(a));
        expandedTerms.add(entry.canonical.toLowerCase());
        matchedAliasesInfo.push({ term, canonical: entry.canonical });
        return true;
      }
    }

    // 2. Fuzzy Match for typos (e.g., "kokothe" -> "kolkata" / "kolkathe", "tumkure" -> "tumkur")
    if (term.length >= 3) {
      for (const key of Object.keys(CITY_ALIASES_MAP)) {
        const entry = CITY_ALIASES_MAP[key];
        for (const alias of entry.aliases) {
          // If edit distance is 1 or similarity is > 0.68
          const dist = levenshteinDistance(term, alias);
          const sim = stringSimilarity(term, alias);
          if (dist <= 2 && (sim >= 0.65 || (term.length <= 4 && dist <= 1))) {
            matchedCities.add(entry.canonical);
            entry.aliases.forEach(a => expandedTerms.add(a));
            expandedTerms.add(entry.canonical.toLowerCase());
            matchedAliasesInfo.push({ term, canonical: entry.canonical, matchedVia: alias });
            return true;
          }
        }
      }
    }
    return false;
  };

  // Check full raw query first
  checkAgainstAliases(rawClean);

  // Check individual tokens
  tokens.forEach(tok => {
    checkAgainstAliases(tok);
  });

  let explanation = null;
  if (matchedAliasesInfo.length > 0) {
    const primary = matchedAliasesInfo[0];
    explanation = `Interpreted "${primary.term}" as ${primary.canonical}`;
  }

  return {
    originalQuery: rawClean,
    tokens,
    matchedCities: Array.from(matchedCities),
    expandedTerms: Array.from(expandedTerms),
    matchedAliasesInfo,
    explanation
  };
}

// Matches an event against search query + expanded terms
function eventMatchesQuery(event, queryExpansion) {
  const { originalQuery, tokens, matchedCities, expandedTerms } = queryExpansion;
  if (!originalQuery) return true;

  const eventCity = (event.city || '').toLowerCase();
  const eventState = (event.state || '').toLowerCase();
  const eventTitle = (event.title || '').toLowerCase();
  const eventTagline = (event.tagline || '').toLowerCase();
  const eventDesc = (event.description || '').toLowerCase();
  const eventVenueName = (event.venueName || '').toLowerCase();
  const eventVenueAddress = (event.venueAddress || '').toLowerCase();
  const eventCategory = (event.category || '').toLowerCase();
  const highlights = Array.isArray(event.highlights) ? event.highlights.join(' ').toLowerCase() : '';

  const searchableBlob = `${eventTitle} ${eventTagline} ${eventDesc} ${eventVenueName} ${eventVenueAddress} ${eventCity} ${eventState} ${eventCategory} ${highlights}`;

  // 1. Direct city canonical match
  if (matchedCities.some(c => c.toLowerCase() === eventCity || c.toLowerCase() === normalizeCity(event.city).toLowerCase())) {
    return true;
  }

  // 2. Exact token or expanded term presence in searchable blob
  for (const term of expandedTerms) {
    if (term.length >= 2 && searchableBlob.includes(term)) {
      return true;
    }
  }

  // 3. Substring check with original query
  if (searchableBlob.includes(originalQuery)) {
    return true;
  }

  // 4. Token-level fuzzy match with title, venue, or city words
  const blobWords = searchableBlob.split(/[\s,.-]+/).filter(w => w.length >= 3);
  for (const tok of tokens) {
    if (tok.length >= 3) {
      for (const word of blobWords) {
        if (stringSimilarity(tok, word) >= 0.75) {
          return true;
        }
      }
    }
  }

  return false;
}

module.exports = {
  CITY_ALIASES_MAP,
  levenshteinDistance,
  stringSimilarity,
  normalizeCity,
  expandSearchQuery,
  eventMatchesQuery
};

