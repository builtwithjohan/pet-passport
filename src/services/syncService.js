import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const syncService = {
  // Sync user's pets to IndexedDB and Supabase cloud if configured
  async syncToCloud(user, pets) {
    if (!user) return { status: 'OFFLINE_GUEST_MODE', lastSynced: null };

    try {
      const userPets = pets.map(p => ({
        ...p,
        ownerId: user.id
      }));

      // 1. Local IndexedDB persistence
      await dbStore.savePetsBulk(userPets);

      // 2. Cloud Supabase sync if enabled
      if (isSupabaseConfigured) {
        for (const pet of userPets) {
          const { error } = await supabase.from('pets').upsert({
            id: pet.id,
            owner_id: user.id,
            name: pet.name,
            species: pet.species || 'Dog',
            breed: pet.breed || 'Unknown',
            sex: pet.sex || 'Unknown',
            dob: pet.dob || null,
            weight_kg: pet.weightKg || null,
            microchip_id: pet.microchipId || '',
            microchip_date: pet.microchipDate || null,
            color: pet.color || '',
            origin_country: pet.originCountry || 'USA',
            destination_country: pet.destinationCountry || 'EU',
            photo_url: pet.photoUrl || '',
            passport_number: pet.passportNumber || `PET-${user.id.slice(0, 4)}-${Date.now()}`
          });
          if (error) console.warn('Supabase pet sync warning:', error.message);
        }
      }

      const syncMetadata = {
        status: isSupabaseConfigured ? 'CLOUD_SYNCED' : 'LOCAL_PERSISTED',
        lastSynced: new Date().toISOString(),
        petCount: pets.length,
        userId: user.id
      };

      localStorage.setItem('pet_passport_sync_meta', JSON.stringify(syncMetadata));
      return syncMetadata;
    } catch (err) {
      console.warn('Failed to sync pets:', err);
      return { status: 'SYNC_ERROR', lastSynced: null };
    }
  },

  // Fetch pets belonging to a specific user
  async getUserPets(userId) {
    if (!userId) return [];
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('pets').select('*').eq('owner_id', userId);
        if (!error && data && data.length > 0) {
          return data.map(p => ({
            id: p.id,
            ownerId: p.owner_id,
            name: p.name,
            species: p.species,
            breed: p.breed,
            sex: p.sex,
            dob: p.dob,
            weightKg: p.weight_kg,
            microchipId: p.microchip_id,
            microchipDate: p.microchip_date,
            color: p.color,
            originCountry: p.origin_country,
            destinationCountry: p.destination_country,
            photoUrl: p.photo_url,
            passportNumber: p.passport_number,
            vaccinations: [],
            documents: [],
            completedChecklistIds: []
          }));
        }
      }
      return await dbStore.getPetsForUser(userId);
    } catch (err) {
      console.warn('Failed to fetch pets for user:', err);
      return [];
    }
  },

  // Generate Family / Vet Sharing Invite Code (expires in 7 days)
  async generateShareCode(pet) {
    const randomHex = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 6).toUpperCase()
      : Math.floor(100000 + Math.random() * 900000);
    const shareCode = `PASS-${randomHex}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const shareRecord = {
      id: 'share_' + Date.now(),
      shareCode,
      petId: pet.id,
      petData: pet,
      createdAt: new Date().toISOString(),
      expiresAt
    };

    await dbStore.saveShare(shareRecord);
    return shareCode;
  },

  // Redeem Family Share Code
  async redeemShareCode(shareCode) {
    if (!shareCode || typeof shareCode !== 'string') {
      throw new Error('Please enter a valid family share code.');
    }

    const cleanCode = shareCode.trim().toUpperCase();
    const shareRecord = await dbStore.getShareByCode(cleanCode);

    if (!shareRecord || !shareRecord.petData) {
      throw new Error(`Share code "${cleanCode}" was not found. Please verify the code with the pet owner.`);
    }

    if (shareRecord.expiresAt && new Date(shareRecord.expiresAt) < new Date()) {
      throw new Error(`Share code "${cleanCode}" has expired. Please ask the pet owner for a new share code.`);
    }

    return {
      ...shareRecord.petData,
      id: 'shared-' + (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now()),
      name: `${shareRecord.petData.name} (Shared)`
    };
  }
};

