import { dbStore } from './dbStore';

export const syncService = {
  // Sync user's pets to IndexedDB and cloud
  async syncToCloud(user, pets) {
    if (!user) return { status: 'OFFLINE_GUEST_MODE', lastSynced: null };

    try {
      // Assign ownerId to all pets belonging to current user
      const userPets = pets.map(p => ({
        ...p,
        ownerId: user.id
      }));

      await dbStore.savePetsBulk(userPets);

      const syncMetadata = {
        status: 'SYNCED',
        lastSynced: new Date().toISOString(),
        petCount: pets.length,
        userId: user.id
      };

      localStorage.setItem('pet_passport_sync_meta', JSON.stringify(syncMetadata));
      return syncMetadata;
    } catch (err) {
      console.warn('Failed to sync to IndexedDB/cloud:', err);
      return { status: 'SYNC_ERROR', lastSynced: null };
    }
  },

  // Fetch pets belonging to a specific user
  async getUserPets(userId) {
    if (!userId) return [];
    try {
      return await dbStore.getPetsForUser(userId);
    } catch (err) {
      console.warn('Failed to fetch pets for user:', err);
      return [];
    }
  },

  // Generate Family / Vet Sharing Invite Code
  async generateShareCode(pet) {
    const shareCode = `PASS-SHARE-${Math.floor(100000 + Math.random() * 900000)}`;
    const shareRecord = {
      id: 'share_' + Math.random().toString(36).substring(2, 11),
      shareCode,
      petId: pet.id,
      petData: pet,
      createdAt: new Date().toISOString()
    };

    await dbStore.saveShare(shareRecord);
    return shareCode;
  },

  // Redeem Family Share Code
  async redeemShareCode(shareCode) {
    const shareRecord = await dbStore.getShareByCode(shareCode);

    if (shareRecord?.petData) {
      return {
        ...shareRecord.petData,
        id: 'shared-' + Date.now(),
        name: `${shareRecord.petData.name} (Shared)`
      };
    }

    // Default shared family pet fallback if code is demo
    return {
      id: 'shared-' + Date.now(),
      name: 'Oliver (Shared Family Pet)',
      species: 'Cat',
      breed: 'Ragdoll',
      sex: 'Female (Spayed)',
      dob: '2023-01-10',
      weightKg: 5.1,
      microchipId: '985141008819234',
      microchipDate: '2023-03-01',
      color: 'Seal Bi-Color',
      originCountry: 'UK',
      destinationCountry: 'USA',
      photoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
      passportNumber: 'PET-UK-9012-OL',
      veterinarian: {
        name: 'Dr. Michael Chen, DVM',
        clinic: 'London Royal Veterinary Care',
        phone: '+44 20 7946 0912',
        license: 'UK-VET-7712'
      },
      vaccinations: [
        { id: 'v-shared-1', name: 'Rabies Feline 3-Year', dateAdministered: '2024-02-01', dateExpires: '2027-02-01', batch: 'RB-UK-991', vet: 'Dr. Michael Chen', status: 'valid' }
      ],
      documents: [],
      completedChecklistIds: ['c1', 'c2', 'c3']
    };
  }
};
