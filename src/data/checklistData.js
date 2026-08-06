export const DEFAULT_CHECKLIST = [
  {
    id: 't-120',
    timeline: '120+ Days Before Departure',
    phase: 'Preparation & Microchipping',
    stressTag: 'Crucial Foundation',
    items: [
      { id: 'c1', title: 'Verify ISO 15-Digit Microchip', desc: 'Ensure pet microchip is ISO 11784/11785 FDX-B compliant and scanned before any vaccinations.', required: true, category: 'Identification' },
      { id: 'c2', title: 'Check Country Entry Requirements', desc: 'Verify destination rules (e.g. EU Annex IV, FAVN Titre test requirements, tapeworm timing).', required: true, category: 'Documentation' },
      { id: 'c3', title: 'Check Airline In-Cabin / Cargo Capacity', desc: 'Ensure airline allows your pet breed & weight on chosen route and plane model.', required: true, category: 'Airline' }
    ]
  },
  {
    id: 't-90',
    timeline: '90 Days Before Departure',
    phase: 'Vaccinations & Blood Tests',
    stressTag: 'Prevent Quarantine',
    items: [
      { id: 'c4', title: 'Administer Rabies Booster / Primary Vaccine', desc: 'Must be given AFTER microchip scan. Note down vaccine batch & lot number.', required: true, category: 'Vaccination' },
      { id: 'c5', title: 'FAVN Rabies Titre Blood Draw (If required)', desc: 'Required for EU (from high-risk), Japan, Australia, UAE. Test blood drawn by accredited vet.', required: false, category: 'Vaccination' },
      { id: 'c6', title: 'Begin Crate / Carrier Acclimation', desc: 'Place carrier in living room with treats, open door, and cozy familiar blanket to build positive association.', required: true, category: 'Anxiety Relief' }
    ]
  },
  {
    id: 't-30',
    timeline: '30 Days Before Departure',
    phase: 'Booking & Carrier Verification',
    stressTag: 'Secure Seat & Gear',
    items: [
      { id: 'c7', title: 'Confirm Airline Pet Reservation', desc: 'Call airline to pay pet fee and attach pet reservation code to your PNR ticket.', required: true, category: 'Airline' },
      { id: 'c8', title: 'Verify Carrier Dimensions & Ventilation', desc: 'Double check height, length, width limits. Ensure 3-4 side mesh ventilation and leak-proof bottom.', required: true, category: 'Equipment' },
      { id: 'c9', title: 'Schedule Official Vet Health Inspection', desc: 'Book appointment with USDA / Government accredited vet within the 10-day pre-flight window.', required: true, category: 'Documentation' }
    ]
  },
  {
    id: 't-10',
    timeline: '10 to 5 Days Before Departure',
    phase: 'Vet Endorsement & Treatments',
    stressTag: 'Official Approval',
    items: [
      { id: 'c10', title: 'Veterinary Health Certificate Exam', desc: 'Vet inspects pet, verifies microchip, signs health certificate & rabies details.', required: true, category: 'Documentation' },
      { id: 'c11', title: 'Government USDA / DEFRA Endorsement', desc: 'Submit cert for official electronic or physical stamp seal.', required: true, category: 'Documentation' },
      { id: 'c12', title: 'Tapeworm / Parasite Treatment (If destination requires)', desc: 'Administer Praziquantel within 24-120 hrs of arrival for UK/Ireland/Finland/Norway/Malta/UAE.', required: false, category: 'Health' }
    ]
  },
  {
    id: 't-1',
    timeline: '24 Hours Before Flight',
    phase: 'Final Prep & Packing',
    stressTag: 'Zero Stress Pack',
    items: [
      { id: 'c13', title: 'Pack Pet Travel Emergency Kit', desc: 'Collapsible water bowl, pee pads, familiar blanket, calming spray (Adaptil/Feliway), extra leash, poop bags, 3 days food.', required: true, category: 'Packing' },
      { id: 'c14', title: 'Affix "Live Animal" Tags & Contact Info', desc: 'Attach waterproof pouch with pet photo, microchip ID, owner contact & destination address to carrier.', required: true, category: 'Safety' },
      { id: 'c15', title: 'Pre-Flight Exercise Walk', desc: 'Give pet a long, calming walk to tire them out naturally before travel.', required: true, category: 'Anxiety Relief' }
    ]
  },
  {
    id: 't-0',
    timeline: 'Flight Day!',
    phase: 'Boarding & Calm Arrival',
    stressTag: 'Smooth Departure',
    items: [
      { id: 'c16', title: 'Light Meal 4 Hours Before Flight', desc: 'Avoid heavy meals right before boarding to prevent motion sickness. Water up to 1 hr before.', required: true, category: 'Health' },
      { id: 'c17', title: 'Airport Pet Relief Station Visit', desc: 'Use designated airport pet relief area before passing TSA security.', required: true, category: 'Travel Day' },
      { id: 'c18', title: 'Present Document Folder at Airport Desk', desc: 'Keep physical Pet Passport, Health Cert, Rabies cert, and Import permit organized in water-resistant folder.', required: true, category: 'Documentation' }
    ]
  }
];

export const ANXIETY_TIPS = [
  {
    title: 'Natural Calming Protocol (No Sedatives)',
    icon: '🌿',
    summary: 'Airlines and veterinarians strictly advise AGAINST heavy sedatives or tranquilizers in flight because they lower blood pressure dangerously at altitude.',
    tips: [
      'Use pheromone sprays (Adaptil for dogs, Feliway for cats) on crate blankets 15 minutes before travel.',
      'Place a worn T-shirt with your scent inside the carrier so your pet feels safe.',
      'Play soft classical music or psychoacoustic canine calming tracks during crate acclimation at home.'
    ]
  },
  {
    title: 'Crate Positive Association',
    icon: '🏠',
    summary: 'Never use the carrier as a punishment. It should feel like their favorite cozy den.',
    tips: [
      'Feed daily meals inside the open carrier 4 weeks before the trip.',
      'Give high-value treats (churu, chicken breast, peanut butter) only when they step inside voluntarily.',
      'Practice short 5-minute car rides in the carrier before taking a long flight.'
    ]
  },
  {
    title: 'Hydration & Motion Sickness Strategy',
    icon: '💧',
    summary: 'Preventing nausea reduces 80% of travel stress and whining.',
    tips: [
      'Freeze water in a clip-on crate bowl the night before. It will melt slowly without sloshing during movement.',
      'Ask your vet about non-sedating anti-nausea medication like Maropitant (Cerenia) if your pet gets car or air sick.',
      'Offer ice cubes during layovers for quick hydration.'
    ]
  }
];
