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

      // 2. Cloud Supabase sync if enabled (pets + child collections)
      if (isSupabaseConfigured && supabase) {
        for (const pet of userPets) {
          // Upsert Pet
          const { error: petErr } = await supabase.from('pets').upsert({
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
          if (petErr) console.warn('Supabase pet sync warning:', petErr.message);

          // Upsert Vaccinations
          if (pet.vaccinations && pet.vaccinations.length > 0) {
            const vacRows = pet.vaccinations.map(v => ({
              id: v.id,
              pet_id: pet.id,
              name: v.name,
              date_administered: v.dateAdministered,
              date_expires: v.dateExpires,
              batch_number: v.batch || '',
              administering_vet_name: v.vet || ''
            }));
            const { error: vacErr } = await supabase.from('vaccinations').upsert(vacRows);
            if (vacErr) console.warn('Supabase vaccinations sync warning:', vacErr.message);
          }

          // Upsert Documents (metadata only)
          if (pet.documents && pet.documents.length > 0) {
            const docRows = pet.documents.map(d => ({
              id: d.id,
              pet_id: pet.id,
              name: d.name,
              document_type: d.type || 'Certificate',
              file_url: d.fileUrl || '',
              status: d.status || 'Stored'
            }));
            const { error: docErr } = await supabase.from('documents').upsert(docRows);
            if (docErr) console.warn('Supabase documents sync warning:', docErr.message);
          }

          // Upsert Checklist Progress
          if (pet.completedChecklistIds && pet.completedChecklistIds.length > 0) {
            const checkRows = pet.completedChecklistIds.map(cid => ({
              pet_id: pet.id,
              completed_checklist_item_id: cid
            }));
            const { error: chkErr } = await supabase.from('checklist_progress').upsert(checkRows);
            if (chkErr) console.warn('Supabase checklist sync warning:', chkErr.message);
          }
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

  // Fetch pets belonging to a specific user with child collections & non-destructive local merge
  async getUserPets(userId) {
    if (!userId) return [];
    try {
      const localPets = await dbStore.getPetsForUser(userId);

      if (isSupabaseConfigured && supabase) {
        const { data: cloudPets, error } = await supabase.from('pets').select('*').eq('owner_id', userId);
        if (!error && cloudPets && cloudPets.length > 0) {
          const mergedPets = await Promise.all(cloudPets.map(async (p) => {
            const localMatch = localPets.find(lp => lp.id === p.id);

            // Fetch child collections from Supabase
            const { data: vacs } = await supabase.from('vaccinations').select('*').eq('pet_id', p.id);
            const { data: docs } = await supabase.from('documents').select('*').eq('pet_id', p.id);
            const { data: chks } = await supabase.from('checklist_progress').select('*').eq('pet_id', p.id);

            const cloudVaccinations = (vacs || []).map(v => ({
              id: v.id,
              name: v.name,
              dateAdministered: v.date_administered,
              dateExpires: v.date_expires,
              batch: v.batch_number,
              vet: v.administering_vet_name
            }));

            const cloudDocuments = (docs || []).map(d => ({
              id: d.id,
              name: d.name,
              type: d.document_type,
              status: d.status,
              fileUrl: d.file_url
            }));

            const cloudChecklistIds = (chks || []).map(c => c.completed_checklist_item_id);

            // Non-destructive merge: if cloud returns empty array but local has items, preserve local items!
            const finalVaccinations = cloudVaccinations.length > 0 
              ? cloudVaccinations 
              : (localMatch?.vaccinations || []);

            const finalDocuments = cloudDocuments.length > 0 
              ? cloudDocuments 
              : (localMatch?.documents || []);

            const finalChecklistIds = cloudChecklistIds.length > 0 
              ? cloudChecklistIds 
              : (localMatch?.completedChecklistIds || []);

            return {
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
              vaccinations: finalVaccinations,
              documents: finalDocuments,
              completedChecklistIds: finalChecklistIds
            };
          }));

          // Save merged pets back to local IndexedDB cache
          await dbStore.savePetsBulk(mergedPets);
          return mergedPets;
        }
      }

      return localPets;
    } catch (err) {
      console.warn('Failed to fetch pets for user:', err);
      return await dbStore.getPetsForUser(userId);
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
      id: 'share_' + (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now()),
      shareCode,
      petId: pet.id,
      petData: pet,
      createdAt: new Date().toISOString(),
      expiresAt
    };

    await dbStore.saveShare(shareRecord);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('pet_shares').insert({
          pet_id: pet.id,
          share_code: shareCode,
          expires_at: expiresAt
        });
      } catch (e) {
        console.warn('Supabase share code sync warning:', e);
      }
    }

    return shareCode;
  },

  // Redeem Family Share Code
  async redeemShareCode(shareCode) {
    if (!shareCode || typeof shareCode !== 'string') {
      throw new Error('Please enter a valid family share code.');
    }

    const cleanCode = shareCode.trim().toUpperCase();

    // 1. Try local IndexedDB
    let shareRecord = await dbStore.getShareByCode(cleanCode);

    // 2. Try Supabase cloud if local record not found
    if (!shareRecord && isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('pet_shares').select('*, pets(*)').eq('share_code', cleanCode).single();
      if (!error && data?.pets) {
        shareRecord = {
          petData: {
            id: data.pets.id,
            name: data.pets.name,
            species: data.pets.species,
            breed: data.pets.breed,
            sex: data.pets.sex,
            microchipId: data.pets.microchip_id,
            passportNumber: data.pets.passport_number,
            vaccinations: [],
            documents: [],
            completedChecklistIds: []
          },
          expiresAt: data.expires_at
        };
      }
    }

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


