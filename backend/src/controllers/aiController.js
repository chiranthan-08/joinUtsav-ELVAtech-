const OpenAI = require('openai');

const openaiApiKey = process.env.OPENAI_API_KEY || '';
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

// Knowledge base of real Indian venues across key metropolitan and destination cities
const CITY_VENUES_DATABASE = {
  bangalore: {
    city: 'Bangalore (Bengaluru)',
    venues: [
      {
        name: 'The Tamarind Tree',
        location: 'Kanakapura Road, Bangalore',
        type: 'Heritage Open-Air Lawn & Antique Courtyards',
        capacity: '500 – 1,200 guests',
        priceRange: '₹4.5 Lakh – ₹8 Lakh rental / ₹1,800 – ₹2,800 per plate',
        highlights: 'Ancient banyan trees, traditional South Indian stone architecture, natural pond, and rustic heritage aesthetic.'
      },
      {
        name: 'Palace Grounds (Gayathri Vihar & White Petals)',
        location: 'Bellary Road, Near Sadashivanagar, Bangalore',
        type: 'Grand Convention Lawns & Air-Conditioned Pavilions',
        capacity: '1,500 – 5,000+ guests',
        priceRange: '₹6 Lakh – ₹15 Lakh rental / ₹1,200 – ₹2,200 per plate',
        highlights: 'Massive pillarless halls, vast parking space for 1,000+ cars, ideal for grand celebrity weddings and mega receptions.'
      },
      {
        name: 'The Leela Palace Bengaluru',
        location: 'Old Airport Road, Kodihalli, Bangalore',
        type: '5-Star Luxury Royal Palace Ballroom & Terraces',
        capacity: '300 – 800 guests',
        priceRange: '₹3,500 – ₹5,500 per plate (minimum banquet spend applies)',
        highlights: 'Vijayanagara architectural opulence, ornate chandeliers, bespoke royal catering, and 5-star bridal suites.'
      },
      {
        name: 'Jaymahal Palace Hotel',
        location: 'Near Cantonment Railway Station, Jayamahal, Bangalore',
        type: 'Colonial Heritage Hotel & Sprawling Green Lawns',
        capacity: '1,000 – 3,500 guests',
        priceRange: '₹4 Lakh – ₹10 Lakh rental / ₹1,400 – ₹2,200 per plate',
        highlights: 'Historic royal charm right in the heart of the city, open-air lawns lit under century-old heritage trees.'
      },
      {
        name: 'Templetree Leisure',
        location: 'Panathur, Near Sarjapur-Outer Ring Road, Bangalore',
        type: 'Eco-Luxury Open Pavilion & Balinese Courtyards',
        capacity: '400 – 1,000 guests',
        priceRange: '₹3.5 Lakh – ₹6 Lakh rental / ₹1,500 – ₹2,400 per plate',
        highlights: 'Modern thatched pavilions, ambient water bodies, lush green canopies, and intimate celebratory vibe.'
      }
    ],
    tips: [
      'Peak wedding season in Bangalore is November through February (pleasant cool evenings) and April/May (Auspicious Chaitra muhurats).',
      'For open lawns, request Bangalore BBMP sound clearance permits for music post 10:00 PM.',
      'Kanakapura Road and Palace Grounds venues offer great vehicular accessibility for large family gatherings.'
    ]
  },
  mumbai: {
    city: 'Mumbai',
    venues: [
      { name: 'Taj Lands End', location: 'Bandstand, Bandra West', type: '5-Star Luxury Seaside Lawn & Ballroom', capacity: '500 – 1,500 guests', priceRange: '₹4,000 – ₹6,500 per plate', highlights: 'Iconic Arabian Sea view, Bandra-Worli Sea Link backdrop, premium celebrity service.' },
      { name: 'NSCI Dome & Palace Lawns', location: 'Worli', type: 'Mega Indoor Stadium & Sea-facing Lawns', capacity: '1,500 – 4,000 guests', priceRange: '₹8 Lakh – ₹25 Lakh rental', highlights: 'World-class acoustic sound, stadium lighting, suitable for grand Bollywood sangeet nights.' },
      { name: 'JW Marriott Juhu', location: 'Juhu Beach', type: 'Beachfront 5-Star Hotel', capacity: '400 – 1,000 guests', priceRange: '₹3,500 – ₹5,500 per plate', highlights: 'Direct sunset views over the ocean, poolside sangeet lawns, and signature wedding delicacies.' }
    ],
    tips: ['Book at least 6 to 9 months in advance for auspicious Hindu/Lagna dates in South & West Mumbai.']
  },
  jaipur: {
    city: 'Jaipur',
    venues: [
      { name: 'Chomu Palace Heritage Resort', location: 'Sikar Road, Chomu, Jaipur', type: '300-year-old Royal Fort Palace', capacity: '500 – 1,500 guests', priceRange: '₹4.5 Lakh / day rental + royal catering', highlights: 'Authentic Rajput courtyards, fresco-painted Darbar halls, shehnai welcome gate.' },
      { name: 'Fairmont Jaipur', location: 'Kukas, Jaipur', type: 'Luxury Mughal-Rajput Palace Resort', capacity: '800 – 2,500 guests', priceRange: '₹3,500 – ₹6,000 per plate', highlights: 'Grand Aravalli hill backdrop, grand elephant welcome, luxury suites for 400+ guests.' },
      { name: 'Rambagh Palace', location: 'Bhawani Singh Road, Jaipur', type: 'Former Residence of the Maharaja of Jaipur', capacity: '400 – 1,200 guests', priceRange: 'Ultra-Luxury heritage tariff', highlights: 'Unrivalled royal grandeur, peacocks on lawns, marble courtyards.' }
    ],
    tips: ['Combine Mehendi and Sangeet into themed courtyards (e.g. Sheesh Mahal or Fountain Lawn) for a complete royal experience.']
  },
  udaipur: {
    city: 'Udaipur',
    venues: [
      { name: 'Jagmandir Island Palace', location: 'Lake Pichola, Udaipur', type: 'Island Palace on Lake Pichola', capacity: '300 – 800 guests', priceRange: 'Exclusive Island Heritage Venue', highlights: 'Boat procession arrival for Baratis, illuminated marble arches, surrounded by lake waters.' },
      { name: 'The Oberoi Udaivilas', location: 'Haridas Ji Ki Magri, Udaipur', type: 'Ultra-Luxury Palace Resort', capacity: '200 – 500 guests', priceRange: 'Top-tier destination tariff', highlights: 'Royal domes, reflection pools, and panoramic views of City Palace across Lake Pichola.' }
    ],
    tips: ['Lake Pichola venues require private boat transfers; organize an acoustic shehnai ensemble on the transfer boats.']
  },
  delhi: {
    city: 'Delhi NCR',
    venues: [
      { name: 'The Grand New Delhi', location: 'Vasant Kunj, South Delhi', type: '5-Star Luxury Resort & Cascading Lawns', capacity: '800 – 2,000 guests', priceRange: '₹3,200 – ₹4,800 per plate', highlights: '10 acres of landscaped greenery, multiple ballroom combinations, and luxury bridal suites.' },
      { name: 'Amaara Farms', location: 'Chattarpur, Delhi', type: 'Boutique Farmhouse & Glasshouse Lawn', capacity: '500 – 1,500 guests', priceRange: '₹5 Lakh – ₹9 Lakh rental', highlights: 'Balinese architecture, dramatic Buddha sculptures, glass canopy dining pavilion.' }
    ],
    tips: ['Chattarpur and NH8 venues have high demand in November-December; plan traffic and valet logistics early.']
  }
};

// Generates an intelligent, comprehensive, human-like response when OpenAI API has quota issues
function generateIntelligentContextualReply(prompt, history = []) {
  const query = prompt.toLowerCase();
  
  // Combine query with recent history to understand ongoing context
  const fullContext = history.map(h => (h.content || '')).join(' ').toLowerCase() + ' ' + query;

  // 1. Detect City
  let detectedCityKey = null;
  if (fullContext.includes('bangalore') || fullContext.includes('bengaluru')) detectedCityKey = 'bangalore';
  else if (fullContext.includes('mumbai') || fullContext.includes('bombay')) detectedCityKey = 'mumbai';
  else if (fullContext.includes('jaipur') || fullContext.includes('rajasthan')) detectedCityKey = 'jaipur';
  else if (fullContext.includes('udaipur')) detectedCityKey = 'udaipur';
  else if (fullContext.includes('delhi') || fullContext.includes('ncr') || fullContext.includes('gurgaon') || fullContext.includes('noida')) detectedCityKey = 'delhi';
  else if (fullContext.includes('ahmedabad') || fullContext.includes('gujarat')) detectedCityKey = 'ahmedabad';
  else if (fullContext.includes('goa')) detectedCityKey = 'goa';
  else if (fullContext.includes('hyderabad')) detectedCityKey = 'hyderabad';
  else if (fullContext.includes('chennai')) detectedCityKey = 'chennai';
  else if (fullContext.includes('kolkata')) detectedCityKey = 'kolkata';
  else if (fullContext.includes('pune')) detectedCityKey = 'pune';

  // 2. Detect Intent: Venues
  const isVenueQuery = query.includes('venue') || query.includes('marriage') || query.includes('wedding') || query.includes('hall') || query.includes('place') || query.includes('lawn') || query.includes('palace') || query.includes('resort') || query.includes('ground') || query.includes('where to');

  if (isVenueQuery && detectedCityKey && CITY_VENUES_DATABASE[detectedCityKey]) {
    const cityData = CITY_VENUES_DATABASE[detectedCityKey];
    let response = `🏰 **Top Wedding & Marriage Venues in ${cityData.city}**:\n\n`;
    response += `Here are the premier curated marriage venues in **${cityData.city}** that are ideal for traditional rituals, sangeet, and grand wedding receptions:\n\n`;

    cityData.venues.forEach((v, idx) => {
      response += `### ${idx + 1}. **${v.name}**\n`;
      response += `📍 **Location**: ${v.location}\n`;
      response += `🏛️ **Type**: ${v.type}\n`;
      response += `👥 **Guest Capacity**: ${v.capacity}\n`;
      response += `💰 **Estimated Tariff**: ${v.priceRange}\n`;
      response += `✨ **Highlights**: ${v.highlights}\n\n`;
    });

    if (cityData.tips && cityData.tips.length > 0) {
      response += `💡 **Local Planner Tips for ${cityData.city}**:\n`;
      cityData.tips.forEach(t => {
        response += `• ${t}\n`;
      });
      response += `\n`;
    }

    response += `🌟 **Next Steps on UtsavMitra**:\n`;
    response += `1. Head to our **[Venues Tab](/venues)** on the platform to submit a direct inquiry with your wedding dates and guest count!\n`;
    response += `2. Use the **[AI Budget Calculator](/ai-planner)** to get precise per-plate and floral decor estimates.\n`;
    response += `3. Once finalized, you can issue **encrypted QR passes** to all your guests for seamless gate attendance! 🪔\n\n`;
    response += `Would you like me to estimate the catering budget or create an auspicious timeline for this celebration?`;
    return response;
  }

  if (isVenueQuery && !detectedCityKey) {
    return `🏰 **Wedding & Event Venue Selection Guide**:\n\n` +
      `Choosing the ideal venue depends on your preferred city, guest count, and the style of celebration you desire:\n\n` +
      `• **Heritage Palaces (Jaipur, Udaipur, Jodhpur)**: Best for royal destination weddings with fresco courtyards, elephant welcomes, and lakeside pheras (e.g. *Chomu Palace*, *Jagmandir Island*).\n` +
      `• **Open-Air Lawns & Heritage Resorts (Bangalore, Hyderabad, Pune)**: Ideal for breezy outdoor receptions, amphitheaters, and floral mandaps under banyan trees (e.g. *The Tamarind Tree*, *Palace Grounds*).\n` +
      `• **Seaside Resorts (Goa, Kerala - Kovalam/Kochi)**: Unforgettable sunset pheras overlooking the Arabian Sea (e.g. *The Leela Kovalam*, *Taj Exotica*).\n` +
      `• **Luxury Convention Ballrooms (Delhi NCR, Mumbai)**: Pillarless, centrally air-conditioned halls for 1,000+ guests with high-tech audio/visual setups.\n\n` +
      `✨ **Which city are you planning your wedding in?** (e.g., Bangalore, Jaipur, Mumbai, Delhi, Udaipur) Tell me your estimated guest count, and I will recommend specific venues with exact capacities and price ranges!`;
  }

  // 3. Detect Intent: Budget
  if (query.includes('budget') || query.includes('cost') || query.includes('price') || query.includes('expense') || query.includes('how much') || query.includes('rupee') || query.includes('lakh')) {
    const guestMatch = query.match(/(\d+)\s*(guests?|people|persons?|pax)/i) || fullContext.match(/(\d+)\s*(guests?|people|persons?|pax)/i);
    const guests = guestMatch ? parseInt(guestMatch[1]) : 300;
    
    return `💰 **Indian Event Budget Strategy (${guests} Guests)**:\n\n` +
      `For a typical Indian celebration of **${guests} guests**, here is the optimal rupee allocation model:\n\n` +
      `1. **Catering & Royal Sweets (38%)**: ₹${((guests * 1800) * 0.75).toLocaleString('en-IN')} – ₹${((guests * 2500) * 1.1).toLocaleString('en-IN')}\n` +
      `   • Welcome mocktail bar & Kesar Thandai\n` +
      `   • Live Chaat Gali (Pani Puri, Dahi Bhalla, Dosa)\n` +
      `   • Royal Gravies (Paneer Lababdar, Dal Bukhara, Zafrani Pulao)\n` +
      `   • Hot dessert counter (Jalebi-Rabdi, Gulab Jamun, Paan counter)\n\n` +
      `2. **Venue & Mandap / Lighting Decor (30%)**:\n` +
      `   • Entrance floral arches with Marigold & Rajnigandha\n` +
      `   • Revolving or lakeside Mandap setup with fairy light cascades\n` +
      `   • Seating diwans, round tables, and stage backdrops\n\n` +
      `3. **Cinematography & Pre-Wedding Shoot (12%)**:\n` +
      `   • 2 Candid photographers, 1 drone pilot, 4K wedding highlight film\n\n` +
      `4. **DJ, Sound Setup & Live Dhol Squad (10%)**:\n` +
      `   • Line-array speakers, moving head beams, authentic Punjabi dhol troupe\n\n` +
      `5. **Shagun, Safas & Favors (6%)**:\n` +
      `   • Traditional Bandhani turbans for Baratis and custom return gift hampers\n\n` +
      `6. **Vedic Panditji & Emergency Buffer (4%)**:\n` +
      `   • Hawan samagri, sound clearances, and backup generator\n\n` +
      `💡 *Tip*: Use UtsavMitra's **[AI Budget Planner](/ai-planner)** tab to customize this interactively with real-time sliders!`;
  }

  // 4. Detect Intent: Haldi / Mehendi / Rituals
  if (query.includes('haldi') || query.includes('ubtan') || query.includes('pithi')) {
    return `💛 **Complete Haldi Ceremony Planning Blueprint**:\n\n` +
      `The Haldi ceremony is one of the most vibrant and joyous pre-wedding rituals! Here is how to plan an unforgettable Haldi:\n\n` +
      `• **Theme & Floral Decor**: Golden Yellow & Kesari palette. Use 2,000+ fresh Marigold (Genda Phool) strings, brass urlis filled with floating petals, and yellow drapes.\n` +
      `• **The Haldi Paste**: Combine organic Kasturi turmeric with sandalwood paste, pure rose water, and raw milk. Avoid chemical colors to keep it safe for sensitive skin.\n` +
      `• **Floral Bath Shower**: Have close friends and family shower the couple with fresh yellow and orange marigold petals right after applying the paste!\n` +
      `• **Dress Code**: All-yellow ethnic attire for guests (yellow kurtas for men, yellow lehengas/sarees for women).\n` +
      `• **Music & Playlist**: Upbeat dholak tracks ("Galla Goriyan", "Kabira", "Mahi Ve", "London Thumakda") accompanied by live dhol players.\n` +
      `• **Cooling Refreshments**: Aam Panna, chilled Kesar Badam Thandai, and fresh coconut water.\n\n` +
      `Would you like me to write a rhyming Hindi/English invitation verse for your Haldi ceremony?`;
  }

  if (query.includes('sangeet') || query.includes('dance') || query.includes('song') || query.includes('music')) {
    return `💃 **Grand Sangeet Night Masterplan**:\n\n` +
      `• **Stage Production**: 24x16 ft elevated wooden stage with high-definition LED backdrop displaying personalized animations and couple memories.\n` +
      `• **Program Flow**:\n` +
      `  1. *Welcome Flashmob*: Cousins and siblings opening with high-energy Bollywood mashups.\n` +
      `  2. *Parents & Elders Waltz*: Heartwarming classic retro melodies.\n` +
      `  3. *Groom & Bride Solo & Duet*: Romantic contemporary choreography with low-fog dry ice.\n` +
      `  4. *Family Dance Faceoff*: Playful competition between Ladkewale vs Ladkiwale.\n` +
      `  5. *Open Dance Floor*: Resident DJ taking over with Bhangra, Bollywood EDM, and chartbusters.\n` +
      `• **Midnight Fuel**: Street food counters (Pav Bhaji, Keema Pav, cutting chai, churros) to keep the dance floor energized till 1 AM!`;
  }

  // 5. Detect Intent: QR Ticketing & Check-In
  if (query.includes('qr') || query.includes('ticket') || query.includes('scanner') || query.includes('pass') || query.includes('attendance') || query.includes('registration')) {
    return `🎟️ **UtsavMitra QR-Code Ticketing & Attendance System**:\n\n` +
      `UtsavMitra solves gate chaos, counterfeit passes, and duplicate entries using modern technology:\n\n` +
      `1. **Encrypted Digital Passes**: Whenever an attendee books or registers (Free or Paid via Razorpay), the platform generates a unique encrypted Pass ID (e.g. \`UM-PASS-8841\`) and high-resolution QR code.\n` +
      `2. **Live Camera Scanner**: Event organizers simply navigate to the **[QR Scanner](/organizer/scanner)** page on their smartphone or laptop and point the camera at attendee badges.\n` +
      `3. **Instant Anti-Duplicate Verification**: The scanner verifies the ticket in under 500ms and records the entry timestamp and gate staff name. If someone tries to re-enter or share the pass, the system flashes a **bold RED duplicate alert** with the exact original check-in details!\n` +
      `4. **Live Roster**: Organizers can monitor check-in percentages live or export the guest list as a printable register.`;
  }

  // 6. Detect Intent: Catering & Food
  if (query.includes('food') || query.includes('catering') || query.includes('menu') || query.includes('dinner') || query.includes('sweet') || query.includes('mithai')) {
    return `🍽️ **Royal Indian Banquet Catering Blueprint**:\n\n` +
      `A quintessential Indian celebration menu features a harmonious balance of regional traditions:\n\n` +
      `• **Welcome Coolers**: Royal Kesar Badam Thandai, Pomegranate Mint Mojito, Tender Coconut Water.\n` +
      `• **Live Chaat Gali**: Chandni Chowk style Pani Puri (with 5 herb waters), Dahi Bhalla Papdi, and Palak Patta Chaat.\n` +
      `• **Signature Starters**: Paneer Tikka Angara, Tandoori Malai Broccoli, Galouti Kebabs on miniature Sheermal.\n` +
      `• **Royal Main Course**:\n` +
      `  - *Paneer Lababdar* in rich tomato cashew gravy\n` +
      `  - *Dal Bukhara* slow-cooked overnight with white butter\n` +
      `  - *Subz Diwani Handi* with seasonal farm vegetables\n` +
      `  - *Awadhi Zafrani Vegetable Biryani* served with Burani garlic raita\n` +
      `  - *Tandoori Breads*: Butter Naan, Laccha Paratha, Missi Roti\n` +
      `• **Dessert Extravaganza**: Hot Kesari Jalebi with chilled Laccha Rabdi, Angoori Gulab Jamun, and artisanal Kolkata Paan counter.\n\n` +
      `💡 *Explore our **[AI Catering Planner](/ai-planner)** tab to generate menus for North Indian, Gujarati, or South Indian cuisines!*`;
  }

  // 7. General Conversational / Greetings / Assistance
  return `Namaste! 🙏 I am **UtsavMitra AI**, your intelligent Indian celebration & event management assistant.\n\n` +
    `I can help you plan traditional and modern celebrations with end-to-end guidance:\n\n` +
    `• 🏰 **Venue Discovery**: Find palaces, lawns, and banquet halls in Bangalore, Jaipur, Mumbai, Delhi, Udaipur, Goa, etc.\n` +
    `• 💰 **AI Budget Estimation**: Realistic rupee calculations for catering, mandap decor, DJ/dhol, and photography.\n` +
    `• ⏰ **Muhurat & Timelines**: Auspicious wedding program flow, college fest schedules, and Dandiya nights.\n` +
    `• 💌 **Digital E-Invites**: Beautiful bilingual Hindi/English invitation cards with automated RSVP tracking.\n` +
    `• 🎟️ **QR-Code Gate Security**: Instant camera scanning to verify tickets and prevent duplicate entries.\n\n` +
    `*What can I help you organize today? Tell me your preferred city, event type, or guest count!*`;
}

// Main Chatbot Assistant Handler
exports.chatAssistant = async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt query is required.' });
    }

    // Try OpenAI API first if key is configured
    if (openai && openaiApiKey) {
      try {
        const messages = [
          { role: 'system', content: UTSAV_SYSTEM_PROMPT }
        ];

        // Append recent conversational context
        if (Array.isArray(history) && history.length > 0) {
          const recent = history.slice(-6);
          for (const msg of recent) {
            if (msg.role && msg.content) {
              messages.push({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: String(msg.content)
              });
            }
          }
        }

        messages.push({ role: 'user', content: prompt });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 750,
          temperature: 0.7
        });

        const reply = completion.choices?.[0]?.message?.content;
        if (reply) {
          return res.status(200).json({
            success: true,
            reply,
            source: 'openai'
          });
        }
      } catch (openAiError) {
        console.warn(`[OpenAI Notice]: ${openAiError.message} - Activating UtsavMitra dynamic contextual AI.`);
      }
    }

    // Dynamic contextual conversational response (handles cities, venues, budgets, traditions)
    const reply = generateIntelligentContextualReply(prompt, history);

    return res.status(200).json({
      success: true,
      reply,
      source: 'utsav_ai'
    });
  } catch (error) {
    console.error('chatAssistant error:', error);
    return res.status(500).json({ success: false, message: 'AI Assistant error.' });
  }
};

const UTSAV_SYSTEM_PROMPT = `
You are UtsavMitra AI (उत्सवमित्र), an intelligent, culturally knowledgeable, and warm Indian Event Management Consultant & Celebration Planner.
You specialize in planning both traditional Indian celebrations and modern events:
- Weddings (Shaadi, Sangeet, Mehendi, Haldi, Varmala, Reception, Pheras)
- Navratri Garba & Dandiya Raas
- College Cultural, Dramatics & Technical Fests (Hackathons, Battle of the Bands, Starlight Pro-Nites)
- Religious & Temple Mahotsavs (Phoolon Ki Holi, Ganesh Utsav, Diwali Melas)
- Corporate Galas, Culinary Carnivals, Birthdays, and Anniversaries.

You provide actionable guidance on auspicious muhurats, traditional rituals, venue setup, multi-course Indian catering menus (North Indian, South Indian, Gujarati, Jain), line-item budgeting in INR (₹), and how UtsavMitra's QR-code ticketing, digital invitations, and Razorpay checkout streamline events.
Maintain an enthusiastic, respectful, and polite tone. Use relevant festive emojis (🪔, 🌸, 💍, 🪘, ✨) and structured markdown where helpful.
`.trim();

// AI Budget Plan Generator
exports.generateBudgetPlan = async (req, res) => {
  try {
    const { eventType = 'Wedding', guestCount = 300, totalBudget = 1000000, city = 'Jaipur' } = req.body;
    const budget = Number(totalBudget);
    const guests = Number(guestCount);

    let breakdown = [];
    let tips = [];

    if (eventType.toLowerCase().includes('wedding') || eventType.toLowerCase().includes('sangeet')) {
      breakdown = [
        {
          category: 'Catering & Royal Sweets (Mithai Counters)',
          percentage: 38,
          amount: Math.round(budget * 0.38),
          perGuest: Math.round((budget * 0.38) / guests),
          items: ['Welcome Mocktails & Thandai', 'Live Chaat & Dosa Counters', 'Main Course (Paneer Lababdar, Dal Makhani, Pulao)', 'Hot Jalebi & Rabdi, Gulab Jamun']
        },
        {
          category: 'Venue & Royal Floral Decor (Marigold & Lights)',
          percentage: 30,
          amount: Math.round(budget * 0.30),
          perGuest: Math.round((budget * 0.30) / guests),
          items: ['Mandap Architecture', 'Fairy Lights & Torans', 'Bridal Stage Backdrop', 'Seating Shamiana & Diwans']
        },
        {
          category: 'Cinematography, Drone & Pre-Wedding Shoot',
          percentage: 12,
          amount: Math.round(budget * 0.12),
          perGuest: Math.round((budget * 0.12) / guests),
          items: ['2 Candid Photographers', '1 Drone Pilot', 'Same-day Highlight Teaser Film', 'Traditional Album']
        },
        {
          category: 'DJ, Live Dhol Troupe & Sangeet Choreography',
          percentage: 10,
          amount: Math.round(budget * 0.10),
          perGuest: Math.round((budget * 0.10) / guests),
          items: ['Live Punjabi Dholak & Tasha', 'Professional DJ Setup & LED Wall', 'Sangeet Choreographer (5 sessions)', 'Anchor / Emcee']
        },
        {
          category: 'Bridal Make-up, Safa/Turban & Shagun Gifts',
          percentage: 6,
          amount: Math.round(budget * 0.06),
          perGuest: Math.round((budget * 0.06) / guests),
          items: ['HD Bridal & Groom Grooming', 'Guest Turban/Safa Bandhani', 'Return Gift Hampers (Dry fruits / Silver coins)']
        },
        {
          category: 'Vedic Panditji, Permissions & Contingency Buffer',
          percentage: 4,
          amount: Math.round(budget * 0.04),
          perGuest: Math.round((budget * 0.04) / guests),
          items: ['Samagri & Hawan Samiti', 'Local Sound Clearance', 'Emergency Medical & Generator Buffer']
        }
      ];

      tips = [
        'Booking a palace or lawn during shoulder months (Feb or Nov) can save 20-30% on venue rentals.',
        'Opt for seasonal Indian flowers like Genda (Marigold) and Rajnigandha instead of imported Orchids to cut decor costs in half with higher festive grandeur.',
        'Use UtsavMitra digital invitations with QR codes to save ₹30,000–₹50,000 on physical card printing and postage.',
        'Combine Sangeet & Ring Ceremony into a single evening slot to reduce venue and catering double costs.'
      ];
    } else if (eventType.toLowerCase().includes('college') || eventType.toLowerCase().includes('fest')) {
      breakdown = [
        {
          category: 'Pro-Nite Star Artist & Celebrity Booking',
          percentage: 45,
          amount: Math.round(budget * 0.45),
          items: ['Headliner Indie Rock / Bollywood Fusion Singer', 'Artist Hospitality & Rider Requirements', 'Security Escort Team']
        },
        {
          category: 'Sound, Stage Rigging & Stadium Truss Lighting',
          percentage: 25,
          amount: Math.round(budget * 0.25),
          items: ['Line Array Sound System (JBL VTX)', 'Moving Head Beams & Hazers', 'LED Mesh Background Screens', 'Heavy Duty Generators']
        },
        {
          category: 'Cash Prizes & Trophies for Competitions',
          percentage: 15,
          amount: Math.round(budget * 0.15),
          items: ['Battle of the Bands', '24hr Hackathon Grand Prize', 'Choreo-Nite Winners', 'Memento Shields for Judges']
        },
        {
          category: 'Volunteer Merch, ID Badges & Food Coupons',
          percentage: 10,
          amount: Math.round(budget * 0.10),
          items: ['Custom Hoodies/Tees for 80 Coordinators', 'Attendee QR Passes', 'Refreshment Boxes']
        },
        {
          category: 'Marketing, Campus Posters & Emergency Medical Team',
          percentage: 5,
          amount: Math.round(budget * 0.05),
          items: ['Digital Ad Campaigns across Colleges', 'Campus Hoardings', 'First Aid On-site Ambulance']
        }
      ];

      tips = [
        'Secure beverage and title sponsorships to offset up to 60% of the main celebrity performance fee.',
        'Use UtsavMitra QR-code instant check-ins to handle peak gate rushes of 2,000+ students without bottlenecks.',
        'Run college band preliminaries online to lower daytime stage usage and acoustic hiring costs.'
      ];
    } else {
      breakdown = [
        { category: 'Catering & Beverages', percentage: 42, amount: Math.round(budget * 0.42), items: ['Buffet & Live Counters', 'Mocktail Bar', 'Custom Celebration Cake'] },
        { category: 'Venue & Ambient Decor', percentage: 28, amount: Math.round(budget * 0.28), items: ['Theme Backdrop', 'Balloon & Floral Arch', 'LED Ambient Lighting'] },
        { category: 'Entertainment, Emcee & Sound', percentage: 18, amount: Math.round(budget * 0.18), items: ['Anchor for Games', 'Surround Sound System & Karaoke', 'Magician or Folk Artists'] },
        { category: 'Favors & Photography', percentage: 12, amount: Math.round(budget * 0.12), items: ['Candid Photographer', 'Return Favors', 'Custom Photo Booth Props'] }
      ];
      tips = [
        'Afternoon or sunset slots between 4 PM to 8 PM provide natural golden hour lighting and lower hall tariffs.',
        'Selfie photobooths with traditional props (turbans, vintage umbrellas) create huge engagement on social media.'
      ];
    }

    return res.status(200).json({
      success: true,
      data: {
        eventType,
        guestCount: guests,
        totalBudget: budget,
        city,
        breakdown,
        estimatedCostPerGuest: Math.round(budget / guests),
        tips
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate AI budget plan.' });
  }
};

// AI Itinerary Generator
exports.generateItinerary = async (req, res) => {
  try {
    const { eventType = 'Wedding', days = 1, startTime = '10:00 AM' } = req.body;

    let schedule = [];
    if (eventType.toLowerCase().includes('wedding')) {
      schedule = [
        { time: '09:00 AM', title: 'Auspicious Ganesh Sthapana & Haldi Utsav', lead: 'Panditji & Maternal Uncle', details: 'Yellow marigold floral shower, traditional ubtan ceremony, and dholak folk songs.' },
        { time: '01:00 PM', title: 'Royal Rajasthani Thali Luncheon', lead: 'Catering Lead', details: 'Gatte ki sabzi, ker sangri, bajre ki roti with fresh white makhan.' },
        { time: '04:30 PM', title: 'High Tea & Safa (Turban) Bandhai', lead: 'Barati Coordinators', details: 'Masala chai, kachori counters, and colorful leheriya safa tying for all guests.' },
        { time: '06:00 PM', title: 'Baraat Procession & Shahi Swagat', lead: 'Brass Band & Dhol Squad', details: 'Vintage car / royal mare arrival with sparklers and nagada fanfare at the gateway.' },
        { time: '07:30 PM', title: 'Grand Varmala Ceremony', lead: 'Stage Producer', details: 'Revolving stage with cold pyrotechnics and rose petal shower from above.' },
        { time: '08:30 PM', title: 'Dinner Banquet & Live Classical Sarangi', lead: 'Executive Chef', details: 'Lavish multi-cuisine buffet opens with live barbecue and tandoori grills.' },
        { time: '11:15 PM', title: 'Sacred Pheras & Saptapadi', lead: 'Vedic Panditji', details: '7 sacred vows around holy Agni under the consecrated floral mandap.' }
      ];
    } else if (eventType.toLowerCase().includes('college')) {
      schedule = [
        { time: '09:30 AM', title: 'Campus Gate Open & QR Pass Scan', lead: 'Registration Team', details: 'Instant scanning of UtsavMitra QR passes, student kit distribution.' },
        { time: '10:30 AM', title: 'Inauguration & Lighting of Lamp', lead: 'Director & Chief Guest', details: 'Saraswati Vandana followed by keynote address.' },
        { time: '11:30 AM', title: 'National Level Hackathon Coding Kickoff', lead: 'Technical Council', details: 'Problem statements unlocked; 24-hour sprint begins.' },
        { time: '02:00 PM', title: 'Street Play (Nukkad Natak) Finals', lead: 'Drama Society', details: 'High-energy social awareness performances at open amphitheater.' },
        { time: '05:00 PM', title: 'Step-Up: Western Dance & Bhangra Battle', lead: 'Cultural Head', details: 'Inter-college dance crews clash on main auditorium stage.' },
        { time: '08:00 PM', title: 'Starlight Pro-Nite Celebrity Concert', lead: 'Headliner Production Team', details: 'Massive open stadium rock and EDM show with laser sync visuals.' }
      ];
    } else {
      schedule = [
        { time: '06:00 PM', title: 'Guest Welcome & Mocktail Bar', lead: 'Host Family', details: 'Ambient background acoustic playlist, Polaroid photo-wall entries.' },
        { time: '07:00 PM', title: 'Interactive Stage Games & Trivia', lead: 'Emcee', details: 'Fun couple / family games with exciting prize hampers.' },
        { time: '08:15 PM', title: 'Cake Cutting & Toast', lead: 'Honoree & Guests', details: 'Celebratory sparklers and signature photo-op.' },
        { time: '08:45 PM', title: 'Grand Dinner Buffet & Dessert Bar', lead: 'Catering Lead', details: 'Hot sizzlers, regional specialties, and live waffle/mithai station.' },
        { time: '10:00 PM', title: 'Open Dance Floor with Resident DJ', lead: 'DJ & Sound Tech', details: 'Bollywood chartbusters and party anthems till late.' }
      ];
    }

    return res.status(200).json({
      success: true,
      data: {
        eventType,
        totalEvents: schedule.length,
        schedule
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate itinerary.' });
  }
};

// AI Bilingual Invitation Poetry
exports.generateInvitationPoetry = async (req, res) => {
  try {
    const { hostNames = 'The Sharma Family', honoree = 'Aarav & Priya', eventType = 'Wedding', date = '15th November 2026', venue = 'Chomu Palace, Jaipur', style = 'royal' } = req.body;

    const shloka = '।। वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ।।';

    const hindiText = `
परम आदरणीय स्वजन,
भगवान श्री गणेश जी की असीम अनुकंपा से,
हमारे सुपुत्र/सुपुत्री ${honoree} के शुभ ${eventType} के पावन अवसर पर 
आपकी गरिमामयी उपस्थिति एवं स्नेहपूर्ण आशीर्वाद सादर प्रार्थनीय है।

दिनांक: ${date}
स्थान: ${venue}

विनीत:
${hostNames} एवं समस्त परिवार
    `.trim();

    const englishText = `
Under the starlit sky and auspicious blessings of the Almighty,
${hostNames}
request the honor of your presence and blessings to celebrate the joyful union of
${honoree}

Date: ${date}
Venue: ${venue}

"Two souls, two traditions, one eternal journey of love and togetherness."
    `.trim();

    return res.status(200).json({
      success: true,
      data: {
        shloka,
        hindiText,
        englishText,
        recommendedTheme: style === 'royal' ? 'royal-marigold' : 'modern-glow'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate invitation copy.' });
  }
};

// AI Catering Menu Planner
exports.generateCateringMenu = async (req, res) => {
  try {
    const { cuisine = 'North Indian Royal', preference = 'Pure Veg', guestCount = 250 } = req.body;

    const menu = {
      welcomeDrinks: ['Royal Kesar Badam Thandai', 'Pomegranate Mint Mojito', 'Fresh Tender Coconut Cooler'],
      liveCounters: ['Dilli 6 Chandni Chowk Chaat Gali (Pani Puri with 5 Flavors, Dahi Bhalla)', 'Amritsari Kulcha with Chole & Imli Chutney', 'Live Woodfired Thin-crust Pizzas & Pastas'],
      mainCourse: ['Paneer Lababdar in Rich Tomato Gravy', 'Dum Aloo Kashmiri with Fennel & Ginger', 'Dal Bukhara (Slow cooked overnight with white butter)', 'Subz Diwani Handi (Seasonal vegetables in royal cashew gravy)', 'Awadhi Zafrani Vegetable Biryani with Burani Raita', 'Assorted Indian Breads: Butter Naan, Laccha Paratha, Missi Roti'],
      desserts: ['Hot Kesari Jalebi with Chilled Laccha Rabdi', 'Angoori Gulab Jamun with Pistachio Slivers', 'Shahi Tukda with Gold Leaf Garnish', 'Kolkata Paan Counter (Meetha & Fire Paan)']
    };

    return res.status(200).json({
      success: true,
      data: {
        cuisine,
        preference,
        guestCount,
        menu,
        estimatedPlateCost: '₹1,200 – ₹1,800 per plate'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate catering menu.' });
  }
};
