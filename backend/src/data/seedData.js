const bcrypt = require('bcryptjs');

const getHashedPassword = (pwd) => {
  return bcrypt.hashSync(pwd, 10);
};

const getSeedData = () => {
  const users = [
    {
      _id: 'usr_superadmin_01',
      name: 'Vikramaditya Rathore',
      email: 'superadmin@utsavmitra.com',
      password: getHashedPassword('Super@123'),
      role: 'super_admin',
      phone: '+91 98290 12345',
      city: 'New Delhi',
      organization: 'UtsavMitra HQ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'active',
      createdAt: '2026-01-01T10:00:00Z',
      lastLogin: '2026-11-02T09:30:00Z'
    },
    {
      _id: 'usr_admin_01',
      name: 'Sunita Mehra',
      email: 'admin@utsavmitra.com',
      password: getHashedPassword('Admin@123'),
      role: 'admin',
      phone: '+91 98110 54321',
      city: 'Jaipur',
      organization: 'UtsavMitra Regional Operations',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status: 'active',
      createdAt: '2026-02-15T11:00:00Z',
      lastLogin: '2026-11-02T10:15:00Z'
    },
    {
      _id: 'usr_organizer_01',
      name: 'Rajesh Singhania',
      email: 'organizer@jaipurfest.com',
      password: getHashedPassword('Org@123'),
      role: 'organizer',
      phone: '+91 94140 88776',
      city: 'Jaipur',
      organization: 'Royal Rajputana Weddings & Events',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      status: 'active',
      createdAt: '2026-03-10T14:00:00Z',
      lastLogin: '2026-11-02T11:45:00Z'
    },
    {
      _id: 'usr_organizer_02',
      name: 'Devika Kulkarni',
      email: 'organizer@mumbaiculture.in',
      password: getHashedPassword('Org@123'),
      role: 'organizer',
      phone: '+91 98200 99881',
      city: 'Mumbai',
      organization: 'Aamchi Mumbai Utsav Mandali',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      status: 'active',
      createdAt: '2026-04-05T09:00:00Z',
      lastLogin: '2026-11-01T18:20:00Z'
    },
    {
      _id: 'usr_organizer_03',
      name: 'Ankit Verma',
      email: 'fest@iitb.ac.in',
      password: getHashedPassword('Org@123'),
      role: 'organizer',
      phone: '+91 97690 11223',
      city: 'Mumbai',
      organization: 'IIT Fest Council & Youth Wing',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      status: 'active',
      createdAt: '2026-05-12T12:00:00Z',
      lastLogin: '2026-11-02T12:00:00Z'
    },
    {
      _id: 'usr_user_01',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      password: getHashedPassword('User@123'),
      role: 'user',
      phone: '+91 98765 11223',
      city: 'New Delhi',
      organization: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      status: 'active',
      createdAt: '2026-06-01T15:00:00Z',
      lastLogin: '2026-11-02T14:10:00Z'
    },
    {
      _id: 'usr_user_02',
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
      password: getHashedPassword('User@123'),
      role: 'user',
      phone: '+91 99090 33445',
      city: 'Ahmedabad',
      organization: '',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'active',
      createdAt: '2026-07-20T16:30:00Z',
      lastLogin: '2026-11-02T13:40:00Z'
    }
  ];

  const events = [
    {
      _id: 'evt_01',
      title: 'Grand Royal Rajasthani Wedding Expo & Sangeet Gala',
      tagline: 'Experience Regal Indian Hospitality, Bridal Couturiers & Sangeet Nights',
      description: 'Step into royal Indian opulence with heritage bridal showcases, live shehnai and sufi performances, royal marigold floral installations, and an exclusive culinary journey through 56 Bhog royal dishes. Meet top destination wedding planners, mehendi artisans, and royal jewelers.',
      category: 'Wedding',
      date: '2026-11-15',
      time: '05:30 PM',
      endDate: '2026-11-16',
      endTime: '11:30 PM',
      venueName: 'Chomu Palace Heritage Courtyard',
      venueAddress: 'Chomu Fort, Sikar Road, Jaipur, Rajasthan',
      city: 'Jaipur',
      state: 'Rajasthan',
      organizerId: 'usr_organizer_01',
      organizerName: 'Royal Rajputana Weddings & Events',
      organizerEmail: 'organizer@jaipurfest.com',
      bannerUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_free_pass',
          name: 'General Visitor Pass',
          price: 0,
          totalSeats: 300,
          bookedSeats: 145,
          description: 'Access to royal bridal pavilions, exhibition stalls & evening shehnai concert',
          perks: ['Free Entry', 'Welcome Drink (Thandai)', 'Exhibition Directory']
        },
        {
          id: 'tier_royal_sangeet',
          name: 'Royal Sangeet Pass',
          price: 1499,
          totalSeats: 150,
          bookedSeats: 89,
          description: 'Front arena seating for Rajasthani folk dances, live Sufi troupe, and 56-Bhog dinner buffet',
          perks: ['Reserved Front Rows', 'Royal Dinner Buffet', 'Gift Hamper', 'Fast-track QR entry']
        },
        {
          id: 'tier_vip_couple',
          name: 'VIP Shahi Couple Pass',
          price: 3499,
          totalSeats: 50,
          bookedSeats: 32,
          description: 'Exclusive lounge access with vintage car royal entry photo-op, turban tying ceremony, and royal hospitality',
          perks: ['2-Person VIP Access', 'Valet Parking', 'Royal Turban & Dupatta Welcome', 'Private Champagne/Mocktail Table']
        }
      ],
      dressCode: 'Royal Ethnic / Traditional Rajasthani (Bandhani, Lehengas, Sherwanis)',
      highlights: [
        '50+ Destination Wedding Planners & Royal Couturiers',
        'Live Sufi & Bollywood Sangeet Night with Manganiyar Troupe',
        'Live 56 Bhog Royal Feast Tasting',
        'Bridal Jewellery Fashion Walk'
      ],
      schedule: [
        { time: '05:30 PM', activity: 'Shahi Nagada & Shehnai Welcome', description: 'Traditional aarti welcome and royal turban tying at the courtyard gateway.' },
        { time: '07:00 PM', activity: 'Bridal Couture Runway', description: 'Showcasing traditional Zardozi and Gotapatti designer ensembles.' },
        { time: '08:30 PM', activity: 'Grand Sangeet & Folk Fusion Night', description: 'Celebrated folk artists and live acoustic Sufi music performance.' },
        { time: '10:00 PM', activity: 'Royal Royal Dinner & Networking', description: 'Authentic Dal Baati Churma, Gatte ki Sabzi, and assorted Indian mithais.' }
      ],
      status: 'approved',
      isFeatured: true,
      totalCapacity: 500,
      viewsCount: 1420,
      createdAt: '2026-10-01T10:00:00Z'
    },
    {
      _id: 'evt_02',
      title: 'Maha Navratri Dandiya Raas 2026 – Falguni & Folk Symphony',
      tagline: 'Gujarat’s Largest Traditional Garba & Dandiya Mahotsav',
      description: 'Nine nights of divine devotion, high-energy dandiya swirls, and enchanting Gujarati folk rhythms under 100,000 fairy lights. Featuring 15-piece live traditional dholak, shehnai, and harmonium orchestration with 30,000+ dancers in full Chaniya Choli splendor.',
      category: 'Cultural Program',
      date: '2026-11-20',
      time: '07:00 PM',
      endDate: '2026-11-20',
      endTime: '01:00 AM',
      venueName: 'Karnavati Club Grand Lawns',
      venueAddress: 'SG Highway, Bodakdev, Ahmedabad, Gujarat',
      city: 'Ahmedabad',
      state: 'Gujarat',
      organizerId: 'usr_organizer_02',
      organizerName: 'Aamchi Mumbai Utsav Mandali',
      organizerEmail: 'organizer@mumbaiculture.in',
      bannerUrl: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_early_dancer',
          name: 'Dandiya Lover Pass',
          price: 499,
          totalSeats: 1000,
          bookedSeats: 620,
          description: 'Single day entrance pass to main Garba lawn with pair of wooden dandiya sticks included',
          perks: ['Pair of Dandiya Sticks', 'Access to Main Arena', 'Food Court Access']
        },
        {
          id: 'tier_season_pass',
          name: 'VIP Circle & Celebrity Lawn',
          price: 1999,
          totalSeats: 200,
          bookedSeats: 165,
          description: 'Elevated wooden dance deck near celebrity stage, air-cooled lounge, and unlimited snack counters',
          perks: ['Elevated Deck Access', 'Unlimited Gujarati Chaat & Fafda-Jalebi', 'Dedicated QR Lane', 'Locker Facility']
        }
      ],
      dressCode: 'Authentic Gujarati Garba Attire (Chaniya Choli / Kediyu Kurta)',
      highlights: [
        'Live 15-Piece Dholak & Folk Orchestra',
        'Prizes for Best Traditional Costume & Best Garba Couple',
        'Over 40 Food Stalls serving Kutch & Kathiawadi delicacies',
        '100% Family Safe Environment with High Security'
      ],
      schedule: [
        { time: '07:00 PM', activity: 'Aarti & Deepotsav', description: 'Auspicious Maa Ambe Mahamangal Aarti with 108 diyas.' },
        { time: '07:45 PM', activity: 'Traditional 3-Taali & Dodhiya', description: 'Opening slow traditional Gujarati circle dances.' },
        { time: '09:30 PM', activity: 'High Tempo Dandiya Raas', description: 'Live dhol beats and synchronized dandiya claps across all 4 zones.' },
        { time: '11:45 PM', activity: 'Sanedo & Awards Ceremony', description: 'Energetic Sanedo rounds and presentation of the Utsav Trophy.' }
      ],
      status: 'approved',
      isFeatured: true,
      totalCapacity: 2000,
      viewsCount: 3100,
      createdAt: '2026-10-05T12:00:00Z'
    },
    {
      _id: 'evt_03',
      title: 'Mood Indigo 2026: Pan-India Youth Cultural & Tech Carnival',
      tagline: 'Asia’s Premier College Fest – Battle of the Bands, Hackathon & Starlight Pro-Nite',
      description: 'The mega annual inter-college celebration uniting over 120+ universities from across the nation. Experience 48-hour AI Hackathons, Street Dance Battles, Hindi Dramatics, Standup Comedy, and a mesmerizing open-air concert by India’s top indie rock and fusion artists.',
      category: 'College Fest',
      date: '2026-12-05',
      time: '10:00 AM',
      endDate: '2026-12-07',
      endTime: '11:00 PM',
      venueName: 'Gymkhana Grounds, IIT Bombay Campus',
      venueAddress: 'Powai, Mumbai, Maharashtra 400076',
      city: 'Mumbai',
      state: 'Maharashtra',
      organizerId: 'usr_organizer_03',
      organizerName: 'IIT Fest Council & Youth Wing',
      organizerEmail: 'fest@iitb.ac.in',
      bannerUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_student_pass',
          name: 'Student Delegate Pass',
          price: 299,
          totalSeats: 1500,
          bookedSeats: 880,
          description: 'Valid college ID required. Grants full 3-day access to workshops, competitions, and daytime events',
          perks: ['Fest Goodie Kit', 'Campus Access', 'Competition Registrations']
        },
        {
          id: 'tier_pronite_concert',
          name: 'All-Access + Concert Pass',
          price: 999,
          totalSeats: 600,
          bookedSeats: 410,
          description: 'Includes evening entry to the main arena for EDM night, Bollywood Star Singer, and Battle of the Bands',
          perks: ['VIP Pro-Nite Pit', 'Express Badge Pickup', 'Meet & Greet Raffle']
        }
      ],
      dressCode: 'College Casuals / Streetwear / Quirky Festival Fits',
      highlights: [
        'Over ₹5,00,000 Cash Prizes across 35 Competitions',
        'National Level 24hr Hackathon in partnership with Leading Tech Giants',
        'Star Concert featuring Top Bollywood & Fusion Rock Band',
        'Food Truck Alley with 30+ Global & Street Food Vendors'
      ],
      schedule: [
        { time: '10:00 AM', activity: 'Opening Ceremony & Keynote', description: 'Inauguration by celebrated alumni and keynote panel on youth innovation.' },
        { time: '01:00 PM', activity: 'Street Play & Battle of the Bands', description: 'High-octane dramatic and musical competitions at the amphitheater.' },
        { time: '05:30 PM', activity: 'Choreonite – Inter-College Dance Clash', description: 'Synchronized Western, Bollywood, and Classical fusion choreography.' },
        { time: '08:30 PM', activity: 'Starlight Pro-Nite Live Concert', description: 'Massive open-air stadium musical concert under spectacular laser lights.' }
      ],
      status: 'approved',
      isFeatured: true,
      totalCapacity: 3000,
      viewsCount: 4500,
      createdAt: '2026-10-10T14:00:00Z'
    },
    {
      _id: 'evt_04',
      title: 'Vrindavan Phoolon Ki Holi & Braj Raas Mahotsav',
      tagline: 'Pure Floral Ecstasy, Temple Bells & Vedic Celebrations',
      description: 'Celebrate the holy festival of colors in the divine traditional style with 5,000 kilograms of fragrant marigold, rose, and tesu petals. No chemical colors! Immerse yourself in Braj folk songs, traditional Rasleela performances, and unlimited authentic Mathura pedas & chilled Kesar Badam Thandai.',
      category: 'Religious',
      date: '2026-12-18',
      time: '09:00 AM',
      endDate: '2026-12-18',
      endTime: '04:00 PM',
      venueName: 'Yamuna Riverfront Amphitheater',
      venueAddress: 'Parikrama Marg, Raman Reti, Vrindavan, Uttar Pradesh',
      city: 'Mathura',
      state: 'Uttar Pradesh',
      organizerId: 'usr_organizer_01',
      organizerName: 'Royal Rajputana Weddings & Events',
      organizerEmail: 'organizer@jaipurfest.com',
      bannerUrl: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_holi_general',
          name: 'Flower Blessing Pass',
          price: 350,
          totalSeats: 800,
          bookedSeats: 520,
          description: 'Includes organic flower basket, white cotton scarf, and traditional temple prasad',
          perks: ['Organic Flower Kit', 'Braj Thandai Coupon', 'Vedic Aarti Seating']
        },
        {
          id: 'tier_holi_family',
          name: 'Kutumb Family Pass (4 Guests)',
          price: 1200,
          totalSeats: 100,
          bookedSeats: 74,
          description: 'Special seating for families with elderly members, covered shamiana, and unlimited satvik brunch',
          perks: ['Reserved Covered Seating', 'Satvik Royal Feast', 'Floral Garlands & Chadar Offering']
        }
      ],
      dressCode: 'Crisp White Traditional Kurta-Pajama or White Salwar Kameez',
      highlights: [
        '5,000 KG Fresh Rose & Marigold Petals showered from towers',
        'Live Haveli Sangeet & Traditional Rasleela Actors from Mathura',
        'Authentic Braj Khaja, Makhan Mishri & Kesar Thandai',
        'Eco-Friendly & Completely Safe for Children and Senior Citizens'
      ],
      schedule: [
        { time: '09:00 AM', activity: 'Shankhnaad & Vedic Havan', description: 'Invoking blessings for peace, joy, and spiritual harmony.' },
        { time: '10:30 AM', activity: 'Mayur Dance & Braj Rasleela', description: 'Traditional dramatic portrayal of Radha Krishna pastimes.' },
        { time: '12:00 PM', activity: 'Phoolon Ki Holi Maha Utsav', description: 'Grand shower of flower petals across the arena with live nagada beats.' },
        { time: '02:00 PM', activity: 'Bhog Prasad & Kirtan Mandali', description: 'Feast of 11 traditional Brajvasi delicacies and ecstatic kirtan.' }
      ],
      status: 'approved',
      isFeatured: false,
      totalCapacity: 1000,
      viewsCount: 2200,
      createdAt: '2026-10-15T09:00:00Z'
    },
    {
      _id: 'evt_05',
      title: 'Bangalore Culinary & Craft Beer Carnival 2026',
      tagline: 'Modern Celebrations, Live Indie Bands & 100+ Gourmet Stalls',
      description: 'The Garden City’s favorite open-air lifestyle celebration! Featuring 20 artisanal microbreweries, masterclasses by celebrity chefs, pet-friendly obstacle parks, flea market with 80 handcrafted Indian lifestyle brands, and an acoustic sundowner stage.',
      category: 'Corporate',
      date: '2026-12-24',
      time: '12:00 PM',
      endDate: '2026-12-25',
      endTime: '10:30 PM',
      venueName: 'Jaymahal Palace Lawns',
      venueAddress: 'Near Cantonment Railway Station, Jayamahal, Bengaluru 560046',
      city: 'Bangalore',
      state: 'Karnataka',
      organizerId: 'usr_organizer_02',
      organizerName: 'Aamchi Mumbai Utsav Mandali',
      organizerEmail: 'organizer@mumbaiculture.in',
      bannerUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_beer_single',
          name: 'Day Explorer Pass',
          price: 599,
          totalSeats: 1200,
          bookedSeats: 430,
          description: 'Access to all culinary stages, flea market, acoustic live concerts and 2 craft beverage tasters',
          perks: ['2 Complimentary Beverage Tasters', 'Souvenir Cup', 'Stage Access']
        },
        {
          id: 'tier_foodie_vip',
          name: 'Gourmet VIP Lounge Pass',
          price: 1899,
          totalSeats: 150,
          bookedSeats: 92,
          description: 'VIP shaded cabana seating with table service, chef tasting platter, and dedicated bar counter',
          perks: ['Chef Curated 4-Course Tasting', 'Unlimited Craft Mocktails/Brew', 'VIP Restrooms', 'Valet Parking']
        }
      ],
      dressCode: 'Chic Casual / Boho Festival Outfits',
      highlights: [
        '20 Top Microbreweries & Mocktail Innovators',
        'Live Cooking Battles with MasterChef Contestants',
        'Pet Friendly Arena with Puppy Play Zones',
        'Sundowner Acoustic Performances by Top Indie Artists'
      ],
      schedule: [
        { time: '12:00 PM', activity: 'Gates Open & Flea Market Browse', description: 'Explore handcrafted ceramics, sustainable apparel, and artisanal spices.' },
        { time: '02:30 PM', activity: 'Masterclass: Modern Indian Street Tapas', description: 'Interactive culinary workshop by award-winning chefs.' },
        { time: '06:00 PM', activity: 'Sunset Acoustic Sessions', description: 'Soothing indie folk and jazz fusion music under fairy lit banyan trees.' },
        { time: '08:30 PM', activity: 'Headliner Rock Act & Craft Brew Tasting', description: 'Energetic rock performance to close out the culinary weekend.' }
      ],
      status: 'approved',
      isFeatured: false,
      totalCapacity: 1500,
      viewsCount: 1890,
      createdAt: '2026-10-20T16:00:00Z'
    },
    // --- NEW DIVERSE CELEBRATIONS ACROSS ALL CATEGORIES ---
    {
      _id: 'evt_06',
      title: 'Arijit Singh Symphony & Bollywood Pro-Nite Live 2026',
      tagline: 'Live 60-Piece Grand Symphony & Bollywood Melodies Under the Stars',
      description: 'Experience an unforgettable musical evening in the Silicon Valley of India! The King of Romance, Arijit Singh, accompanied by a 60-piece international symphony orchestra performing his timeless chartbusters. Multi-tiered stadium seating, world-class acoustic engineering, and synchronized wristband light displays.',
      category: 'Concert',
      date: '2026-12-12',
      time: '06:30 PM',
      endDate: '2026-12-12',
      endTime: '11:00 PM',
      venueName: 'Palace Grounds, Gayathri Vihar',
      venueAddress: 'Bellary Road, Near Sadashivanagar, Bangalore, Karnataka 560080',
      city: 'Bangalore',
      state: 'Karnataka',
      organizerId: 'usr_organizer_02',
      organizerName: 'Aamchi Mumbai Utsav Mandali',
      organizerEmail: 'organizer@mumbaiculture.in',
      bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_concert_silver',
          name: 'Silver Grandstand Pass',
          price: 999,
          totalSeats: 3000,
          bookedSeats: 1820,
          description: 'Tiered bleacher seating with direct view of main stage and LED audio towers',
          perks: ['Grandstand Access', 'LED Glow Wristband', 'Food Court Access']
        },
        {
          id: 'tier_concert_gold',
          name: 'Gold Fan Pit',
          price: 2499,
          totalSeats: 1000,
          bookedSeats: 740,
          description: 'Standing arena directly in front of main stage thrust for hardcore music enthusiasts',
          perks: ['Front Fan Pit Access', 'Dedicated Fast-Track QR Lane', 'Concert Tour Lanyard']
        },
        {
          id: 'tier_concert_vip',
          name: 'Royal VIP Lounge with Hospitality',
          price: 5499,
          totalSeats: 250,
          bookedSeats: 190,
          description: 'Elevated luxury deck with plush lounge seating, unlimited premium catering buffet and bar service',
          perks: ['Elevated Private Deck', 'Unlimited Gourmet Food & Beverages', 'VIP Valet Parking', 'Artist Meet & Greet Raffle']
        }
      ],
      dressCode: 'Concert Chic / Glam Casuals',
      highlights: [
        '60-Piece Live International Classical & Bollywood Symphony Orchestra',
        'State-of-the-Art L-Acoustics K1 Stadium Sound System',
        'Over 3 Hours of Non-stop Soul-stirring Melodies',
        'Over 50 Curated Food & Beverage Counters'
      ],
      schedule: [
        { time: '05:00 PM', activity: 'Gate Opening & QR Fast-Scan', description: 'Attendees scan digital QR tickets at designated lanes.' },
        { time: '06:30 PM', activity: 'Opening Acoustic Fusion Set', description: 'Showcase by rising indie folk and classical sitar-fusion artists.' },
        { time: '07:45 PM', activity: 'Arijit Singh & Symphony Grand Entry', description: 'Massive opening sequence featuring full 60-piece orchestra.' },
        { time: '10:45 PM', activity: 'Grand Finale & Confetti Shower', description: 'Spectacular fireworks and laser display closing the musical night.' }
      ],
      status: 'approved',
      isFeatured: true,
      totalCapacity: 5000,
      viewsCount: 6800,
      createdAt: '2026-10-22T10:00:00Z'
    },
    {
      _id: 'evt_07',
      title: 'Sunburn Arena Goa Sunset Beach Bash 2026',
      tagline: 'Asia’s Biggest Open-Air Beach EDM & Sunset Electronic Music Festival',
      description: 'Dance on the sun-kissed sands of Vagator as world-renowned DJs spin high-octane electronic, progressive house, and trance tracks. Experience massive kinetic stage designs, flame projectors, laser visual shows, and beachside bohemian flea markets.',
      category: 'Concert',
      date: '2026-12-28',
      time: '04:00 PM',
      endDate: '2026-12-29',
      endTime: '02:00 AM',
      venueName: 'Vagator Hilltop Beach Arena',
      venueAddress: 'Ozran Beach Road, Vagator, Goa 403509',
      city: 'Goa',
      state: 'Goa',
      organizerId: 'usr_organizer_03',
      organizerName: 'IIT Fest Council & Youth Wing',
      organizerEmail: 'fest@iitb.ac.in',
      bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_goa_early',
          name: 'Sunburn Beach Pass',
          price: 1499,
          totalSeats: 2500,
          bookedSeats: 1420,
          description: 'Full day access to beach dance arena, sunset chill-out zone, and food court',
          perks: ['Beach Arena Access', 'Welcome Beer/Mocktail', 'Eco Wristband']
        },
        {
          id: 'tier_goa_vip',
          name: 'VIP Shaded Cabana Deck',
          price: 3499,
          totalSeats: 300,
          bookedSeats: 240,
          description: 'Elevated wooden deck overlooking the Arabian Sea sunset with private bar service and air-cooled cabanas',
          perks: ['Private Cabana Table', 'Finger Foods Tasting Platter', 'Express QR Check-in', 'Private Restrooms']
        }
      ],
      dressCode: 'Beach Bohemian / Tropical Festival Fits',
      highlights: [
        'Top Global & Indian EDM Headliners',
        'Epic Sunset over the Arabian Sea with Fire Dancers',
        'Water Sports & Sunset Volleyball Courts',
        'Beach BBQ and Cocktail Shacks'
      ],
      schedule: [
        { time: '04:00 PM', activity: 'Sundowner Deep House Set', description: 'Relaxed grooves as the golden hour sun sets into the sea.' },
        { time: '07:00 PM', activity: 'Bass & Pyro Stage Activation', description: 'High tempo electronic and bass drops with flame throwers.' },
        { time: '09:30 PM', activity: 'International Headliner Main Act', description: 'Spectacular 2-hour headline set with synchronized laser beams.' }
      ],
      status: 'approved',
      isFeatured: true,
      totalCapacity: 3000,
      viewsCount: 4100,
      createdAt: '2026-10-24T12:00:00Z'
    },
    {
      _id: 'evt_08',
      title: 'Royal Rajwada 50th Golden Jubilee Birthday & Shahi Dawat',
      tagline: 'Regal Rajasthani Birthday Celebration with Ghazals, Royal Darbar & 56-Bhog',
      description: 'Celebrate a milestone 50th birthday fit for an emperor! Set in a frescoed heritage courtyard with traditional Nagada salutations, personalized turban tying for all guests, a mesmerizing live evening of Mehdi Hassan ghazals, and an elaborate candlelit royal dinner.',
      category: 'Birthday',
      date: '2026-12-08',
      time: '06:30 PM',
      endDate: '2026-12-08',
      endTime: '11:45 PM',
      venueName: 'Chomu Palace Heritage Courtyard',
      venueAddress: 'Chomu Fort, Sikar Road, Jaipur, Rajasthan 303702',
      city: 'Jaipur',
      state: 'Rajasthan',
      organizerId: 'usr_organizer_01',
      organizerName: 'Royal Rajputana Weddings & Events',
      organizerEmail: 'organizer@jaipurfest.com',
      bannerUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_bday_guest',
          name: 'Shahi Birthday Guest Pass',
          price: 999,
          totalSeats: 200,
          bookedSeats: 110,
          description: 'Includes royal garland greeting, Ghazal recital seating, and full 5-course banquet',
          perks: ['Ghazal Evening Access', 'Royal Rajasthani Buffet', 'Celebration Cake Slice', 'Custom Souvenir']
        },
        {
          id: 'tier_bday_family',
          name: 'Kutumb Family Table (4 Guests)',
          price: 3499,
          totalSeats: 30,
          bookedSeats: 22,
          description: 'Reserved family round table with dedicated royal butler service and personalized silver gift memento',
          perks: ['Reserved Front Table', 'Personalized Butler Service', 'Silver Memento Box', 'Valet Parking']
        }
      ],
      dressCode: 'Royal Indian Ethnic (Bandhgala, Kurta-Churidar, Silk Sarees)',
      highlights: [
        'Live Ghazal & Sufi Ensemble under illuminated palace arches',
        'Spectacular 5-tier Royal Pistachio & Saffron Celebration Cake',
        'Traditional Aarti & Marwar Turban tying ceremony for all attendees',
        'Authentic 56-Bhog Royal Thali banquet'
      ],
      schedule: [
        { time: '06:30 PM', activity: 'Shahi Swagat & Turban Tying', description: 'Guests welcomed with rose water sprinkling and Bandhani safas.' },
        { time: '07:30 PM', activity: 'Ghazal Mehfil & Family Tributes', description: 'Soulful live ghazals and nostalgic family audiovisual journey.' },
        { time: '09:00 PM', activity: 'Royal Cake Cutting & Fireworks', description: 'Sparklers and celebratory toasts in the central courtyard.' },
        { time: '09:30 PM', activity: 'Shahi Dawat Banquet Opens', description: 'Authentic Daal Baati Churma, Ker Sangri, and royal halwas.' }
      ],
      status: 'approved',
      isFeatured: false,
      totalCapacity: 350,
      viewsCount: 1540,
      createdAt: '2026-10-25T11:00:00Z'
    },
    {
      _id: 'evt_09',
      title: 'Neon Glow Sky-Lounge 18th Milestone Birthday Bash',
      tagline: 'Electrifying Neon Light Party with Celebrity DJ, Mocktail Bar & Photobooth',
      description: 'The ultimate coming-of-age celebration! A rooftop high-energy party drenched in blacklight UV neon glows, glow-in-the-dark face artists, unlimited gourmet sliders & woodfired pizzas, and live mixes by Mumbai’s favorite club DJs.',
      category: 'Birthday',
      date: '2026-12-19',
      time: '07:00 PM',
      endDate: '2026-12-20',
      endTime: '01:00 AM',
      venueName: 'Skyline Rooftop Club & Lounge',
      venueAddress: 'Dr. Annie Besant Road, Worli, Mumbai 400018',
      city: 'Mumbai',
      state: 'Maharashtra',
      organizerId: 'usr_organizer_02',
      organizerName: 'Aamchi Mumbai Utsav Mandali',
      organizerEmail: 'organizer@mumbaiculture.in',
      bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_neon_party',
          name: 'Neon Party Pass',
          price: 799,
          totalSeats: 300,
          bookedSeats: 195,
          description: 'Includes neon glow accessories, UV body painting, mocktail coupon, and open dance floor',
          perks: ['Glow Kit & Glasses', '2 Signature Mocktails', 'Dance Floor Access']
        },
        {
          id: 'tier_neon_vip',
          name: 'VIP Rooftop Cabana (Group of 5)',
          price: 3499,
          totalSeats: 25,
          bookedSeats: 18,
          description: 'Private shaded rooftop cabana with dedicated server, chef snack platters, and 360-degree skyline views',
          perks: ['Private Cabana Seating', 'Gourmet Tapas Platter', 'Priority DJ Song Requests', 'Fast-Track QR Entry']
        }
      ],
      dressCode: 'Neon Brights / White (Glows under Blacklight)',
      highlights: [
        'Live UV Blacklight Art Studio for face and wrist designs',
        'Resident Celebrity Club DJ spinning Hip-Hop, Pop & Bollywood Remixes',
        'Custom 360-Degree Video Photobooth for TikTok & Instagram reels',
        'Unlimited Mocktail Smoke Bar and Dessert Fondue Fountain'
      ],
      schedule: [
        { time: '07:00 PM', activity: 'Glow Station Open & Mocktails', description: 'Guests get custom neon paint and glow bands upon arrival.' },
        { time: '08:30 PM', activity: 'Grand Cake Reveal & Lightshow', description: 'Illuminated neon birthday cake cutting with cold sparkler fountains.' },
        { time: '09:00 PM', activity: 'DJ Club Set & Open Dance Floor', description: 'High tempo party hits on the open-air rooftop deck.' }
      ],
      status: 'approved',
      isFeatured: false,
      totalCapacity: 450,
      viewsCount: 2300,
      createdAt: '2026-10-26T14:00:00Z'
    },
    {
      _id: 'evt_10',
      title: 'South Indian Sacred Kalyana Mandapam & Bridal Showcase',
      tagline: 'Traditional Nadaswaram, Kanjivaram Bridal Runway & Authentic Elai Sappadu Feast',
      description: 'Immerse yourself in timeless Dravidian wedding heritage! Featuring master Nadaswaram and Thavil artists from Thanjavur, authentic handwoven Kanjivaram silk bridal showcases, sacred floral Mandap inspirations crafted from jasmine and banana leaves, and an authentic 24-item traditional plantain leaf banquet.',
      category: 'Wedding',
      date: '2026-12-21',
      time: '08:00 AM',
      endDate: '2026-12-21',
      endTime: '04:00 PM',
      venueName: 'The Tamarind Tree Courtyard',
      venueAddress: 'Kanakapura Road, Avalahalli, Bangalore, Karnataka 560062',
      city: 'Bangalore',
      state: 'Karnataka',
      organizerId: 'usr_organizer_01',
      organizerName: 'Royal Rajputana Weddings & Events',
      organizerEmail: 'organizer@jaipurfest.com',
      bannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_kalyana_visitor',
          name: 'General Exhibition Pass',
          price: 0,
          totalSeats: 500,
          bookedSeats: 260,
          description: 'Free entrance to bridal pavilions, wedding vendor stalls, and classical Nadaswaram concerts',
          perks: ['Free Entry', 'Filter Coffee Welcome', 'Wedding Planning Directory']
        },
        {
          id: 'tier_elai_sappadu',
          name: 'Elai Sappadu Royal Feast Pass',
          price: 899,
          totalSeats: 300,
          bookedSeats: 185,
          description: 'Reserved traditional seated lunch banquet served on banana leaves with 24 authentic South Indian delicacies',
          perks: ['Authentic 24-Item Sadhya/Elai Feast', 'Front Seating for Bridal Show', 'Gift Pack of Mysore Pak']
        }
      ],
      dressCode: 'Traditional South Indian (Pattu Sarees, Silk Dhotis with Angavastram)',
      highlights: [
        'Live Temple Nadaswaram & Thavil Maestros from Tamil Nadu',
        'Authentic 24-Dish Traditional Kalyana Sappadu on Banana Leaves',
        'Exhibition of 40+ Certified Kanjivaram & Temple Jewellery Artisans',
        'Live Temple Kolam & Fresh Jasmine Floral Mandap Workshops'
      ],
      schedule: [
        { time: '08:00 AM', activity: 'Mangala Nadaswaram & Filter Coffee', description: 'Sacred morning musical awakening with piping hot Kumbakonam degree coffee.' },
        { time: '10:00 AM', activity: 'Kanjivaram Silk & Gold Jewelry Runway', description: 'Showcasing heirloom bridal drapes and traditional Temple jewelry sets.' },
        { time: '12:30 PM', activity: 'Royal Kalyana Elai Sappadu Banquet', description: 'Traditional plantain leaf feast featuring Bisibelebath, Avial, Payasam & Poli.' }
      ],
      status: 'approved',
      isFeatured: true,
      totalCapacity: 800,
      viewsCount: 2900,
      createdAt: '2026-10-27T09:00:00Z'
    },
    {
      _id: 'evt_11',
      title: 'Lakeside Royal Destination Wedding & Sufi Sangeet Night',
      tagline: 'Romantic Lake Pichola Twilight Celebrations with Sufi Troupes & Candlelit Mandap',
      description: 'Set against the shimmering waters of Lake Pichola with the illuminated City Palace as backdrop. Featuring arrival by illuminated royal barges, evening Sufi Qawwali night by renowned Nizami Brothers, and an unforgettable waterfront royal feast.',
      category: 'Wedding',
      date: '2026-12-22',
      time: '05:00 PM',
      endDate: '2026-12-23',
      endTime: '01:00 AM',
      venueName: 'Radisson Blu Waterfront Lawn',
      venueAddress: 'Near Fateh Sagar Lake, Ambamata, Udaipur, Rajasthan 313001',
      city: 'Udaipur',
      state: 'Rajasthan',
      organizerId: 'usr_organizer_01',
      organizerName: 'Royal Rajputana Weddings & Events',
      organizerEmail: 'organizer@jaipurfest.com',
      bannerUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_udaipur_sufi',
          name: 'Lakeside Sufi Delegate Pass',
          price: 1899,
          totalSeats: 250,
          bookedSeats: 160,
          description: 'Includes royal barge transfer across the lake, Sufi mehfil front seating, and Mewari dinner banquet',
          perks: ['Lake Boat Transfer', 'Live Sufi Mehfil', 'Mewari Royal Buffet', 'Welcome Garland']
        }
      ],
      dressCode: 'Royal Destination Ethnic (Sherwanis, Anarkalis, Regal Bandhgalas)',
      highlights: [
        'Illuminated Royal Boat Transfer across Lake Pichola',
        'Live Sufi Qawwali by Celebrated Nizami Troupe',
        'Floating Diya Ceremony & Lakefront Pyrotechnics',
        'Mewari Royal Culinary Feast'
      ],
      schedule: [
        { time: '05:00 PM', activity: 'Sunset Royal Boat Procession', description: 'Baratis arrive via fairy-lit boats accompanied by live shehnai.' },
        { time: '07:00 PM', activity: 'Lakefront Sufi Mehfil', description: 'Soulful acoustic Sufi musical poetry on the waterfront deck.' },
        { time: '09:30 PM', activity: 'Mewari Royal Dinner Buffet', description: 'Gourmet Laal Maas, Dal Baati, and Ghevar dessert counters.' }
      ],
      status: 'approved',
      isFeatured: false,
      totalCapacity: 400,
      viewsCount: 2100,
      createdAt: '2026-10-28T15:00:00Z'
    },
    {
      _id: 'evt_12',
      title: 'Dilli Haat Grand Diwali Deepotsav & Craft Mela',
      tagline: '100,000 Handcrafted Diyas, Terracotta Artisans & Chandni Chowk Food Street',
      description: 'Delhi’s largest traditional Diwali carnival celebrating the victory of light! Over 200 master craftsmen from 18 states showcasing handcrafted earthen lamps, brass idols, Zari textiles, and handloom gifts. Savor authentic Old Delhi street food with live folk dance and puppet shows.',
      category: 'Cultural Program',
      date: '2026-11-12',
      time: '11:00 AM',
      endDate: '2026-11-14',
      endTime: '10:00 PM',
      venueName: 'Dilli Haat Open Amphitheater',
      venueAddress: 'INA Colony, Kidwai Nagar West, New Delhi 110023',
      city: 'New Delhi',
      state: 'Delhi',
      organizerId: 'usr_organizer_02',
      organizerName: 'Aamchi Mumbai Utsav Mandali',
      organizerEmail: 'organizer@mumbaiculture.in',
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_diwali_entry',
          name: 'Festival Day Pass',
          price: 150,
          totalSeats: 3000,
          bookedSeats: 1950,
          description: 'Full day entrance to all craft stalls, folk performances, and Diwali light displays',
          perks: ['General Admission', 'Set of 4 Handcrafted Terracotta Diyas', 'Flea Market Access']
        },
        {
          id: 'tier_diwali_family',
          name: 'Diwali Festive Hamper Pass (4 Guests)',
          price: 750,
          totalSeats: 400,
          bookedSeats: 310,
          description: 'Entrance for 4 family members plus exclusive artisan Diwali gift box with assorted dry fruits and brass diya',
          perks: ['4x Entry Passes', 'Artisan Brass Diya & Sweets Box', 'Reserved Evening Concert Seating']
        }
      ],
      dressCode: 'Bright Indian Festive Wear (Kurtas, Sarees, Dupattas)',
      highlights: [
        '100,000 Earthen Lamps lit synchronously at twilight',
        '200+ Master Craftsmen from Rajasthan, Bengal, Kashmir & Gujarat',
        'Authentic Chandni Chowk Jalebi, Rabdi & Dahi Bhalla food lane',
        'Puppet Shows, Kalbelia Folk Dancers & Fire Acrobats'
      ],
      schedule: [
        { time: '11:00 AM', activity: 'Craft Bazaar & Food Street Opens', description: 'Explore handloom stalls and savor regional snacks.' },
        { time: '06:00 PM', activity: 'Maha Deepotsav Light-Up', description: 'Lighting of 100,000 diyas with live Vedic chants.' },
        { time: '08:00 PM', activity: 'Sufi & Folk Music Showcase', description: 'Celebrated Rajasthani Manganiyar and Qawwali musical groups.' }
      ],
      status: 'approved',
      isFeatured: false,
      totalCapacity: 4000,
      viewsCount: 3800,
      createdAt: '2026-10-29T10:00:00Z'
    },
    {
      _id: 'evt_13',
      title: 'Durga Puja Dhunuchi Naach & Grand Maha Aarti Mahotsav',
      tagline: 'Traditional Sindoor Khela, Ecstatic Dhaak Beats & Authentic Bengali Khichuri Bhog',
      description: 'Experience the divine devotion and grand cultural fervor of Kolkata’s celebrated Durga Utsav! Featuring majestic hand-carved pandals, 108 lotus flower pushpanjali, mesmerizing Dhunuchi dance competitions with live Dhaakis, and traditional community Bhog.',
      category: 'Cultural Program',
      date: '2026-10-18',
      time: '07:00 AM',
      endDate: '2026-10-21',
      endTime: '11:30 PM',
      venueName: 'Salt Lake Stadium Central Lawns',
      venueAddress: 'JB Block, Sector III, Bidhannagar, Kolkata, West Bengal 700098',
      city: 'Kolkata',
      state: 'West Bengal',
      organizerId: 'usr_organizer_02',
      organizerName: 'Aamchi Mumbai Utsav Mandali',
      organizerEmail: 'organizer@mumbaiculture.in',
      bannerUrl: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_pandal_free',
          name: 'General Pandal Darshan',
          price: 0,
          totalSeats: 5000,
          bookedSeats: 3200,
          description: 'Free visitor pass for Maa Durga Pandal Darshan and evening cultural stage shows',
          perks: ['Free Entry', 'Pushpanjali Access', 'Cultural Shows']
        },
        {
          id: 'tier_bhog_pass',
          name: 'Maha Bhog & Aarti Pass',
          price: 450,
          totalSeats: 800,
          bookedSeats: 620,
          description: 'Includes consecrated traditional Khichuri, Labra, Chutney & Payesh Mahaprasad seated luncheon',
          perks: ['Mahaprasad Bhog Luncheon', 'VIP Pushpanjali Lane', 'Rosogolla Box']
        }
      ],
      dressCode: 'Traditional Bengali Attire (Red & White Garad Sarees, Kurta-Dhoti)',
      highlights: [
        'Mesmerizing Dhunuchi Dance Competition with 50+ Dhaakis',
        'Consecrated Authentic Bengali Khichuri Bhog feast',
        'Evening Rabindra Sangeet & Baul Folk Music concerts',
        'Spectacular Eco-Friendly Idol Immersion Procession'
      ],
      schedule: [
        { time: '07:00 AM', activity: 'Mahashtami Pushpanjali & Aarti', description: 'Offering of 108 lotuses and holy chants to Maa Durga.' },
        { time: '01:00 PM', activity: 'Community Maha Bhog Distribution', description: 'Traditional sit-down feast served to all registered delegates.' },
        { time: '06:30 PM', activity: 'Sandhya Aarti & Dhunuchi Naach Clash', description: 'High-energy clay pot incense dance accompanied by ecstatic dhaak rhythms.' }
      ],
      status: 'approved',
      isFeatured: false,
      totalCapacity: 6000,
      viewsCount: 4700,
      createdAt: '2026-10-30T11:00:00Z'
    },
    {
      _id: 'evt_14',
      title: 'India AI & Tech Founders Gala Night 2026',
      tagline: 'High-Table Executive Dinner, Fireside Keynotes & Networking for 800+ Leaders',
      description: 'The definitive annual conclave uniting India’s visionary startup founders, AI researchers, and tech pioneers in the Silicon Valley of Asia. An evening of intellectual fireside debates, 5-course gourmet dining, and private deal-room lounges.',
      category: 'Corporate',
      date: '2026-12-16',
      time: '06:00 PM',
      endDate: '2026-12-16',
      endTime: '11:00 PM',
      venueName: 'The Leela Palace Grand Ballroom',
      venueAddress: 'Old Airport Road, Kodihalli, Bangalore, Karnataka 560008',
      city: 'Bangalore',
      state: 'Karnataka',
      organizerId: 'usr_organizer_03',
      organizerName: 'IIT Fest Council & Youth Wing',
      organizerEmail: 'fest@iitb.ac.in',
      bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
      ticketTiers: [
        {
          id: 'tier_founder_pass',
          name: 'Founder Delegate Pass',
          price: 2999,
          totalSeats: 400,
          bookedSeats: 280,
          description: 'Full access to keynote stages, interactive AI debate panels, networking cocktails & 5-course dinner',
          perks: ['Keynote & Panel Access', 'Cocktail Networking', 'Executive Dinner Banquet', 'Attendee Directory App']
        },
        {
          id: 'tier_cxo_vip',
          name: 'CXO & Investor Lounge Pass',
          price: 6499,
          totalSeats: 100,
          bookedSeats: 82,
          description: 'Private deal-making lounge with table service, pre-dinner investor roundtable, and valet parking',
          perks: ['Private Investor Lounge', '1-on-1 Deal Rooms', 'Top-Shelf Dining', 'Dedicated Concierge']
        }
      ],
      dressCode: 'Business Formal / Smart Executive Western',
      highlights: [
        'Keynote Panels with Top Unicorn Founders & AI Lab Directors',
        'Gourmet 5-Course Plated Banquet by MasterChefs',
        'Curated 1-on-1 Networking Deal Rooms',
        'Annual UtsavMitra Tech Innovator Awards'
      ],
      schedule: [
        { time: '06:00 PM', activity: 'Executive Registration & Cocktails', description: 'Fast QR badge pickup and networking over artisanal mocktails and hors d\'oeuvres.' },
        { time: '07:15 PM', activity: 'Keynote Panel: The Future of Agentic AI', description: 'Fireside discussion with leading Indian AI founders.' },
        { time: '08:45 PM', activity: 'Awards Presentation & High-Table Dinner', description: 'Honoring top innovators followed by multi-course plated dinner.' }
      ],
      status: 'approved',
      isFeatured: false,
      totalCapacity: 500,
      viewsCount: 3200,
      createdAt: '2026-10-31T14:00:00Z'
    }
  ];

  const bookings = [
    {
      _id: 'bkg_01',
      passId: 'UM-PASS-8841',
      eventId: 'evt_01',
      eventTitle: 'Grand Royal Rajasthani Wedding Expo & Sangeet Gala',
      eventDate: '2026-11-15',
      eventVenue: 'Chomu Palace Heritage Courtyard, Jaipur',
      userId: 'usr_user_01',
      userName: 'Aarav Sharma',
      userEmail: 'aarav.sharma@gmail.com',
      userPhone: '+91 98765 11223',
      ticketTier: 'Royal Sangeet Pass',
      quantity: 2,
      unitPrice: 1499,
      totalAmount: 2998,
      paymentStatus: 'paid',
      paymentMethod: 'razorpay',
      razorpayPaymentId: 'pay_RZP_JaipurRoyal_8841',
      razorpayOrderId: 'order_ORD_JaipurRoyal_101',
      qrCodeDataUrl: '',
      attendanceStatus: 'checked_in',
      checkedInAt: '2026-11-02T11:30:00Z',
      checkedInBy: 'usr_organizer_01',
      createdAt: '2026-10-25T14:20:00Z'
    },
    {
      _id: 'bkg_02',
      passId: 'UM-PASS-9923',
      eventId: 'evt_02',
      eventTitle: 'Maha Navratri Dandiya Raas 2026 – Falguni & Folk Symphony',
      eventDate: '2026-11-20',
      eventVenue: 'Karnavati Club Grand Lawns, Ahmedabad',
      userId: 'usr_user_02',
      userName: 'Priya Patel',
      userEmail: 'priya.patel@gmail.com',
      userPhone: '+91 99090 33445',
      ticketTier: 'VIP Circle & Celebrity Lawn',
      quantity: 1,
      unitPrice: 1999,
      totalAmount: 1999,
      paymentStatus: 'paid',
      paymentMethod: 'razorpay',
      razorpayPaymentId: 'pay_RZP_Navratri_9923',
      razorpayOrderId: 'order_ORD_Navratri_202',
      qrCodeDataUrl: '',
      attendanceStatus: 'checked_in',
      checkedInAt: '2026-11-02T11:45:00Z',
      checkedInBy: 'usr_organizer_02',
      createdAt: '2026-10-28T09:15:00Z'
    },
    {
      _id: 'bkg_03',
      passId: 'UM-PASS-7734',
      eventId: 'evt_03',
      eventTitle: 'Mood Indigo 2026: Pan-India Youth Cultural & Tech Carnival',
      eventDate: '2026-12-05',
      eventVenue: 'Gymkhana Grounds, IIT Bombay Campus',
      userId: 'usr_user_01',
      userName: 'Aarav Sharma',
      userEmail: 'aarav.sharma@gmail.com',
      userPhone: '+91 98765 11223',
      ticketTier: 'All-Access + Concert Pass',
      quantity: 1,
      unitPrice: 999,
      totalAmount: 999,
      paymentStatus: 'paid',
      paymentMethod: 'razorpay',
      razorpayPaymentId: 'pay_RZP_MoodI_7734',
      razorpayOrderId: 'order_ORD_MoodI_303',
      qrCodeDataUrl: '',
      attendanceStatus: 'pending',
      checkedInAt: null,
      checkedInBy: null,
      createdAt: '2026-10-29T18:40:00Z'
    },
    {
      _id: 'bkg_04',
      passId: 'UM-PASS-6612',
      eventId: 'evt_06',
      eventTitle: 'Arijit Singh Symphony & Bollywood Pro-Nite Live 2026',
      eventDate: '2026-12-12',
      eventVenue: 'Palace Grounds, Gayathri Vihar, Bangalore',
      userId: 'usr_user_01',
      userName: 'Aarav Sharma',
      userEmail: 'aarav.sharma@gmail.com',
      userPhone: '+91 98765 11223',
      ticketTier: 'Gold Fan Pit',
      quantity: 2,
      unitPrice: 2499,
      totalAmount: 4998,
      paymentStatus: 'paid',
      paymentMethod: 'razorpay',
      razorpayPaymentId: 'pay_RZP_Arijit_6612',
      razorpayOrderId: 'order_ORD_Arijit_404',
      qrCodeDataUrl: '',
      attendanceStatus: 'pending',
      checkedInAt: null,
      checkedInBy: null,
      createdAt: '2026-10-30T12:00:00Z'
    }
  ];

  const venues = [
    {
      _id: 'ven_01',
      name: 'Chomu Palace Heritage Resort & Royal Darbar',
      city: 'Jaipur',
      state: 'Rajasthan',
      address: 'Chomu Fort, Near Jaipur-Sikar Highway, Jaipur 303702',
      capacity: 1200,
      pricePerDay: 450000,
      type: 'Palace / Heritage',
      amenities: ['Royal Suites', 'Heritage Courtyards', 'In-house Shehnai Troupe', 'Helipad Access', 'Valet Parking for 300 Cars', 'Royal Marigold Decor Support'],
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'
      ],
      contactPerson: 'Thakur Mahendra Singh',
      contactPhone: '+91 98290 88123',
      contactEmail: 'weddings@chomupalace.com',
      rating: 4.9,
      reviewsCount: 88,
      description: 'A 300-year-old regal fort palace reflecting authentic Rajput grandeur with fresco-painted halls, sprawling lawns, and luxury suites fit for royalty.',
      inquiries: [
        {
          userName: 'Rohan Agarwal',
          userEmail: 'rohan.agarwal@example.com',
          userPhone: '+91 98200 44556',
          eventType: 'Grand Sangeet & Reception',
          eventDate: '2026-12-20',
          guestsCount: 500,
          message: 'Interested in booking the main courtyard and 50 rooms for 2 nights. Please send package estimate.',
          status: 'pending',
          createdAt: '2026-11-01T10:00:00Z'
        }
      ],
      status: 'available'
    },
    {
      _id: 'ven_02',
      name: 'The Leela Kovalam & Seaside Banquet Lawns',
      city: 'Thiruvananthapuram',
      state: 'Kerala',
      address: 'Kovalam Beach Cliff, Thiruvananthapuram, Kerala 695527',
      capacity: 800,
      pricePerDay: 350000,
      type: 'Lawn / Resort',
      amenities: ['Arabian Sea Cliff View', 'Beachfront Mandap Area', 'Infinity Pool Lawn', 'Ayurvedic Spa for Guests', 'Dedicated Bridal Lounge'],
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'
      ],
      contactPerson: 'Lakshmi Nair',
      contactPhone: '+91 94470 66554',
      contactEmail: 'events@leelakovalam.in',
      rating: 4.8,
      reviewsCount: 64,
      description: 'Dramatic clifftop luxury venue offering breathtaking panoramic views of the Arabian Sea for romantic sunset ceremonies and destination weddings.',
      inquiries: [],
      status: 'available'
    },
    {
      _id: 'ven_03',
      name: 'The Grand Imperial Convention & Ballroom',
      city: 'New Delhi',
      state: 'Delhi NCR',
      address: 'Janpath, Connaught Place, New Delhi 110001',
      capacity: 1500,
      pricePerDay: 500000,
      type: 'Banquet Hall',
      amenities: ['Central Air Conditioning', 'Crystal Chandeliers', 'Pillarless 25,000 sq.ft Hall', 'Green Rooms for Artists', 'State of the art Acoustic Sound System'],
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80'
      ],
      contactPerson: 'Siddharth Chadha',
      contactPhone: '+91 98100 22334',
      contactEmail: 'banquets@grandimperialdelhi.com',
      rating: 4.7,
      reviewsCount: 112,
      description: 'Lutyens Delhi premier address for corporate galas, high-profile wedding receptions, and celebrity concerts with cutting-edge production facilities.',
      inquiries: [],
      status: 'available'
    },
    {
      _id: 'ven_04',
      name: 'The Tamarind Tree Heritage Courtyard & Lawns',
      city: 'Bangalore',
      state: 'Karnataka',
      address: 'Kanakapura Road, Avalahalli, Bangalore, Karnataka 560062',
      capacity: 1200,
      pricePerDay: 480000,
      type: 'Lawn / Resort',
      amenities: ['Ancient Banyan Courtyard', 'Stone Open-Air Amphitheater', 'Heritage Pavilions', 'Bridal Suite', 'Natural Pond', 'Green Rooms'],
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
      ],
      contactPerson: 'Meenakshi Sundaram',
      contactPhone: '+91 98450 11998',
      contactEmail: 'events@tamarindtree.in',
      rating: 4.9,
      reviewsCount: 145,
      description: 'Enchanting Bangalore heritage venue with majestic trees, traditional stone mandaps, and serene lotus ponds perfect for South Indian and destination weddings.',
      inquiries: [],
      status: 'available'
    },
    {
      _id: 'ven_05',
      name: 'The Leela Palace Grand Ballroom & Royal Gardens',
      city: 'Bangalore',
      state: 'Karnataka',
      address: '23, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560008',
      capacity: 900,
      pricePerDay: 650000,
      type: 'Palace / Heritage',
      amenities: ['Vijayanagara Empire Inspired Architecture', 'Grand Crystal Ballroom', 'Outdoor Cascading Waterfalls', 'Michelin-Class Catering', 'Luxury Royal Suites', 'Valet Parking for 500 Cars'],
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'
      ],
      contactPerson: 'Kavitha Ramesh',
      contactPhone: '+91 98800 24680',
      contactEmail: 'weddings.bangalore@theleela.com',
      rating: 5.0,
      reviewsCount: 198,
      description: 'Opulent palace hotel inspired by the grandeur of the Vijayanagara dynasty with ornate arches, gold leaf ceilings, and lush manicured gardens.',
      inquiries: [],
      status: 'available'
    },
    {
      _id: 'ven_06',
      name: 'Palace Grounds Princess Shrine & Regal Lawns',
      city: 'Bangalore',
      state: 'Karnataka',
      address: 'Bellary Road, Jayamahal, Bengaluru, Karnataka 560006',
      capacity: 3500,
      pricePerDay: 750000,
      type: 'Lawn / Resort',
      amenities: ['Mega 40,000 sq.ft Open Lawn', 'Pillarless Covered German Hangar', 'Ample Parking for 1500 Vehicles', 'Royal Tudor-style Facade', 'Separate Dining Pavilions'],
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80'
      ],
      contactPerson: 'Vinay Kumar',
      contactPhone: '+91 98440 99112',
      contactEmail: 'princessshrine@palacegrounds.com',
      rating: 4.8,
      reviewsCount: 220,
      description: 'Iconic Bangalore venue renowned for mega wedding receptions, cultural carnivals, and live concerts surrounded by historic royal trees.',
      inquiries: [],
      status: 'available'
    }
  ];

  const invitations = [
    {
      _id: 'inv_01',
      title: 'Aarav & Priya’s Shahi Sangeet Celebration',
      hostName: 'The Sharma & Patel Families',
      eventType: 'Wedding & Sangeet',
      eventDate: '2026-11-28',
      eventTime: '06:30 PM onwards',
      venue: 'Chomu Palace Heritage Courtyard, Jaipur',
      theme: 'royal-marigold',
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
      customMessage: 'Together with their families, Aarav & Priya cordially invite you to celebrate an evening of music, traditional dance, and eternal love under the starlit Rajasthani sky.',
      rsvpList: [
        {
          guestName: 'Kunal Kapoor',
          guestPhone: '+91 98201 11223',
          guestsCount: 2,
          status: 'attending',
          message: 'Can’t wait to dance on the dhol beats! Congratulations!',
          dietaryNotes: 'Pure Vegetarian',
          submittedAt: '2026-10-27T10:00:00Z'
        },
        {
          guestName: 'Meera Deshmukh',
          guestPhone: '+91 98110 33445',
          guestsCount: 1,
          status: 'attending',
          message: 'Heartiest wishes to the lovely couple!',
          dietaryNotes: 'Jain Meal preferred',
          submittedAt: '2026-10-28T14:30:00Z'
        }
      ],
      slug: 'aarav-priya-sangeet-2026',
      createdBy: 'usr_user_01',
      createdAt: '2026-10-20T11:00:00Z'
    }
  ];

  const auditLogs = [
    {
      _id: 'aud_01',
      actorId: 'usr_superadmin_01',
      actorName: 'Vikramaditya Rathore',
      actorRole: 'super_admin',
      action: 'SYSTEM_INITIALIZED',
      targetType: 'SYSTEM',
      targetId: 'sys_core',
      details: 'Platform core services initialized with Razorpay Gateway & QR verification active.',
      ipAddress: '127.0.0.1',
      createdAt: '2026-11-01T00:00:00Z'
    },
    {
      _id: 'aud_02',
      actorId: 'usr_admin_01',
      actorName: 'Sunita Mehra',
      actorRole: 'admin',
      action: 'EVENT_APPROVED',
      targetType: 'EVENT',
      targetId: 'evt_01',
      details: 'Approved Grand Royal Rajasthani Wedding Expo for public discovery and ticket sales.',
      ipAddress: '192.168.1.10',
      createdAt: '2026-11-01T10:15:00Z'
    },
    {
      _id: 'aud_03',
      actorId: 'usr_organizer_01',
      actorName: 'Rajesh Singhania',
      actorRole: 'organizer',
      action: 'QR_PASS_CHECKED_IN',
      targetType: 'BOOKING',
      targetId: 'bkg_01',
      details: 'Scanned Pass ID UM-PASS-8841 at Gate #1 (Guest: Aarav Sharma). Entry permitted.',
      ipAddress: '192.168.1.45',
      createdAt: '2026-11-02T11:30:00Z'
    }
  ];

  const systemSettings = {
    platformName: 'UtsavMitra',
    platformFeePercent: 5,
    razorpayTestMode: true,
    autoApproveEvents: false,
    supportEmail: 'support@utsavmitra.in',
    emergencyHelpline: '+91 1800 200 8822',
    maintenanceMode: false,
    updatedAt: '2026-11-02T12:00:00Z',
    updatedBy: 'Vikramaditya Rathore'
  };

  return { users, events, bookings, venues, invitations, auditLogs, systemSettings };
};

module.exports = { getSeedData };
