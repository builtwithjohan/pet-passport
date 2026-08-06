export const SAMPLE_PETS = [
  {
    id: 'pet-1',
    name: 'Milo',
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
    passportNumber: 'PET-US-8921-ML',
    veterinarian: {
      name: 'Dr. Sarah Jenkins, DVM',
      clinic: 'Metropolitan Animal Hospital',
      phone: '+1 (555) 234-5678',
      license: 'US-VET-98214'
    },
    vaccinations: [
      { id: 'v1', name: 'Rabies (3-Year Purevax)', dateAdministered: '2024-03-10', dateExpires: '2027-03-10', batch: 'RB-90214-X', vet: 'Dr. Sarah Jenkins', status: 'valid' },
      { id: 'v2', name: 'DHPP / Distemper-Parvo', dateAdministered: '2024-03-10', dateExpires: '2025-03-10', batch: 'DH-38291', vet: 'Dr. Sarah Jenkins', status: 'valid' },
      { id: 'v3', name: 'Bordetella Kennel Cough', dateAdministered: '2024-06-15', dateExpires: '2025-06-15', batch: 'BD-10294', vet: 'Dr. Sarah Jenkins', status: 'valid' },
      { id: 'v4', name: 'FAVN Rabies Titre Test (0.85 IU/ml)', dateAdministered: '2024-04-12', dateExpires: '2026-04-12', batch: 'FAVN-LAB-8812', vet: 'Kansas State Vet Lab', status: 'valid' }
    ],
    documents: [
      { id: 'd1', name: 'USDA Health Certificate Annex IV', type: 'PDF Certificate', dateAdded: '2024-07-01', status: 'Endorsed', fileSize: '1.2 MB' },
      { id: 'd2', name: 'Rabies Vaccination Record Card', type: 'Proof of Vaccine', dateAdded: '2024-03-11', status: 'Verified', fileSize: '850 KB' },
      { id: 'd3', name: 'FAVN Blood Titre Official Results', type: 'Laboratory Report', dateAdded: '2024-04-20', status: 'Verified', fileSize: '2.1 MB' }
    ],
    completedChecklistIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']
  },
  {
    id: 'pet-2',
    name: 'Luna',
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
    passportNumber: 'PET-US-3310-LN',
    veterinarian: {
      name: 'Dr. Alex Rivera, DVM',
      clinic: 'Feline & Canine Care Center',
      phone: '+1 (555) 987-6543',
      license: 'US-VET-44319'
    },
    vaccinations: [
      { id: 'v20', name: 'Rabies 1-Year Feline', dateAdministered: '2024-01-15', dateExpires: '2025-01-15', batch: 'RB-FEL-331', vet: 'Dr. Alex Rivera', status: 'warning' },
      { id: 'v21', name: 'FVRCP Tri-cat Vaccine', dateAdministered: '2024-01-15', dateExpires: '2025-01-15', batch: 'FV-88910', vet: 'Dr. Alex Rivera', status: 'valid' }
    ],
    documents: [
      { id: 'd20', name: 'Microchip Registration Certificate', type: 'Identification', dateAdded: '2022-11-16', status: 'Verified', fileSize: '640 KB' }
    ],
    completedChecklistIds: ['c1', 'c2', 'c3']
  }
];
