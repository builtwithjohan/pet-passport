export const SAMPLE_PETS = [
  {
    id: 'pet-1',
    isSample: true,
    name: 'Milo (Demo)',
    species: 'Dog',
    breed: 'Golden Retriever',
    sex: 'Male (Neutered)',
    dob: '2021-05-14',
    weightKg: 24.5,
    microchipId: '985141002938471',
    microchipDate: '2021-07-20',
    color: 'Honey Golden',
    originCountry: 'USA',
    destinationCountry: 'EU',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    passportNumber: 'PET-DEMO-8921-ML',
    veterinarian: {
      name: 'Dr. Sample Vet, DVM (Demo)',
      clinic: 'Demo Veterinary Care',
      phone: '+1 (555) 000-0199',
      license: 'DEMO-VET-0000'
    },
    vaccinations: [
      { id: 'v1', name: 'Rabies (3-Year Purevax)', type: 'rabies', dateAdministered: '2024-03-10', dateExpires: '2027-03-10', batch: 'RB-90214-X', vet: 'Dr. Sample Vet' },
      { id: 'v2', name: 'DHPP / Distemper-Parvo', type: 'dhpp', dateAdministered: '2024-03-10', dateExpires: '2025-03-10', batch: 'DH-38291', vet: 'Dr. Sample Vet' },
      { id: 'v3', name: 'Bordetella Kennel Cough', type: 'bordetella', dateAdministered: '2024-06-15', dateExpires: '2025-06-15', batch: 'BD-10294', vet: 'Dr. Sample Vet' },
      { id: 'v4', name: 'FAVN Rabies Titre Test (0.85 IU/ml)', type: 'titre', dateAdministered: '2024-04-12', dateExpires: '2026-04-12', batch: 'FAVN-LAB-8812', vet: 'Sample Vet Lab' }
    ],
    documents: [
      { id: 'd1', name: 'USDA Health Certificate Annex IV (Sample)', type: 'PDF Certificate', dateAdded: '2024-07-01', status: 'Stored', fileSize: '1.2 MB' },
      { id: 'd2', name: 'Rabies Vaccination Record Card (Sample)', type: 'Proof of Vaccine', dateAdded: '2024-03-11', status: 'Stored', fileSize: '850 KB' },
      { id: 'd3', name: 'FAVN Blood Titre Official Results (Sample)', type: 'Laboratory Report', dateAdded: '2024-04-20', status: 'Stored', fileSize: '2.1 MB' }
    ],
    completedChecklistIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']
  },
  {
    id: 'pet-2',
    isSample: true,
    name: 'Luna (Demo)',
    species: 'Cat',
    breed: 'Siamese Cross',
    sex: 'Female (Spayed)',
    dob: '2022-09-01',
    weightKg: 4.2,
    microchipId: '985141009182374',
    microchipDate: '2022-11-15',
    color: 'Seal Point',
    originCountry: 'USA',
    destinationCountry: 'UK',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    passportNumber: 'PET-DEMO-3310-LN',
    veterinarian: {
      name: 'Dr. Sample Vet, DVM (Demo)',
      clinic: 'Demo Veterinary Care',
      phone: '+1 (555) 000-0199',
      license: 'DEMO-VET-0000'
    },
    vaccinations: [
      { id: 'v20', name: 'Rabies 1-Year Feline', type: 'rabies', dateAdministered: '2024-01-15', dateExpires: '2025-01-15', batch: 'RB-FEL-331', vet: 'Dr. Sample Vet' },
      { id: 'v21', name: 'FVRCP Tri-cat Vaccine', type: 'fvrcp', dateAdministered: '2024-01-15', dateExpires: '2025-01-15', batch: 'FV-88910', vet: 'Dr. Sample Vet' }
    ],
    documents: [
      { id: 'd20', name: 'Microchip Registration Certificate (Sample)', type: 'Identification', dateAdded: '2022-11-16', status: 'Stored', fileSize: '640 KB' }
    ],
    completedChecklistIds: ['c1', 'c2', 'c3']
  }
];
