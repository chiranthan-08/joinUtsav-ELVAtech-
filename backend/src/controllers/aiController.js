// AI-Powered Event Assistant Engine for Indian Traditional & Modern Celebrations

exports.generateBudgetPlan = async (req, res) => {
  try {
    const { eventType = 'Wedding', guestCount = 300, totalBudget = 1000000, city = 'Jaipur' } = req.body;
    const budget = Number(totalBudget);
    const guests = Number(guestCount);

    // Dynamic ratios based on event type
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
          items: ['Live Punajbi Dholak & Tasha', 'Professional DJ Setup & LED Wall', 'Sangeet Choreographer (5 sessions)', 'Anchor / Emcee']
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
      // General celebrations / Birthdays / Cultural
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

exports.chatAssistant = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt query is required.' });
    }

    const query = prompt.toLowerCase();
    let reply = '';

    if (query.includes('haldi') || query.includes('ubtan')) {
      reply = 'For a vibrant Haldi ceremony, plan: 1) Marigold (Genda phool) backdrop with brass urlis for floral bath. 2) Yellow attire for both family and guests. 3) Organic turmeric paste infused with rose water and sandalwood. 4) Upbeat folk tracks like "Galla Goriyan" and "Mahi Ve" with live dholak artists. 5) Refreshing drinks like Aam Panna and chilled Nimbu Pani.';
    } else if (query.includes('qr') || query.includes('ticket') || query.includes('attendance') || query.includes('pass')) {
      reply = 'UtsavMitra handles end-to-end QR ticketing: 1) Upon booking, guests receive an encrypted digital pass with a unique Pass ID. 2) At the venue gate, organizers simply open the "QR Scanner" tab on mobile or laptop. 3) Pointing the camera at the guest pass instantly validates tickets and records entry time, preventing duplicate entry attempts!';
    } else if (query.includes('budget') || query.includes('cost')) {
      reply = 'In typical Indian events, allocate 35–40% to catering, 30% to venue and decor, 12% to photography/videography, 10% to entertainment/DJ, and keep 5–8% as contingency. Use UtsavMitra’s "AI Budget Planner" in the top bar to get exact line-item estimates in rupees!';
    } else if (query.includes('muhurat') || query.includes('timing') || query.includes('timeline')) {
      reply = 'Timings are crucial in Indian festivities! Standard wedding evening flow: Baraat assembly at 5:30 PM, Milni & Gateway welcome at 6:30 PM, Grand Varmala at 7:30 PM under twilight, Dinner from 8:00 PM to 10:30 PM, and sacred Pheras at the auspicious midnight/Lagna muhurat.';
    } else {
      reply = `Namaste! As your UtsavMitra AI Event Companion, I can assist you with traditional rituals, modern stage production, venue discovery across Indian cities, automated digital invitations, and real-time QR attendance management. Feel free to ask about specific ceremonies (Sangeet, Haldi, Reception), budgeting advice, or custom catering menus!`;
    }

    return res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'AI Assistant error.' });
  }
};
