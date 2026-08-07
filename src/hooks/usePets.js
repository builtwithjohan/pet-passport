import { useState, useEffect, useCallback } from 'react';
import { SAMPLE_PETS } from '../data/samplePets';
import { authService } from '../services/authService';
import { syncService } from '../services/syncService';

export function usePets() {
  const [pets, setPets] = useState(() => {
    try {
      const saved = localStorage.getItem('pet_passport_pets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.warn('Failed to parse local pets storage:', err);
    }
    return SAMPLE_PETS;
  });

  const [activePetId, setActivePetId] = useState(() => pets[0]?.id || 'pet-1');
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'toast-' + Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Restore user session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          const userPets = await syncService.getUserPets(user.id);
          if (userPets && userPets.length > 0) {
            setPets(userPets);
            setActivePetId(userPets[0].id);
          }
        }
      } catch (err) {
        addToast('Failed to restore cloud user session', 'error');
      }
    }
    restoreSession();
  }, [addToast]);

  // Persist pets locally and sync to cloud
  useEffect(() => {
    try {
      localStorage.setItem('pet_passport_pets', JSON.stringify(pets));
    } catch (err) {
      console.warn('Failed to persist pets to localStorage:', err);
    }

    if (currentUser) {
      const userPetsToSync = pets.filter(p => !p.isSample);
      if (userPetsToSync.length > 0) {
        syncService.syncToCloud(currentUser, userPetsToSync).catch(err => {
          addToast('Background cloud sync error', 'error');
        });
      }
    }
  }, [pets, currentUser, addToast]);

  const activePet = pets.find(p => p.id === activePetId) || pets[0];

  const handleAuthSuccess = useCallback(async (user) => {
    setCurrentUser(user);
    try {
      const userPets = await syncService.getUserPets(user.id);
      if (userPets && userPets.length > 0) {
        setPets(userPets);
        setActivePetId(userPets[0].id);
        addToast(`Welcome back, ${user.name || user.email}! Loaded ${userPets.length} pet profile(s).`, 'success');
      } else {
        const userCreatedPets = pets.filter(p => !p.isSample).map(p => ({ ...p, ownerId: user.id }));
        if (userCreatedPets.length > 0) {
          setPets(userCreatedPets);
          await syncService.syncToCloud(user, userCreatedPets);
          addToast('Local pet profiles associated with your account.', 'success');
        }
      }
    } catch (err) {
      addToast('Error syncing user pets upon login', 'error');
    }
  }, [pets, addToast]);

  const addPet = useCallback((newPet) => {
    setPets(prev => [...prev, newPet]);
    setActivePetId(newPet.id);
    addToast(`Added ${newPet.name}'s passport profile`, 'success');
  }, [addToast]);

  const updatePet = useCallback((updatedPet) => {
    setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
    addToast(`Updated ${updatedPet.name}'s passport profile & photo`, 'success');
  }, [addToast]);

  const importSharedPet = useCallback((sharedPet) => {
    setPets(prev => [sharedPet, ...prev]);
    setActivePetId(sharedPet.id);
    addToast(`Imported shared passport for ${sharedPet.name}`, 'success');
  }, [addToast]);

  const addVaccine = useCallback((petId, newVaccine) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, vaccinations: [newVaccine, ...(p.vaccinations || [])] } : p));
    addToast('Saved vaccination record', 'success');
  }, [addToast]);

  const deleteVaccine = useCallback((petId, vaccineId) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, vaccinations: (p.vaccinations || []).filter(v => v.id !== vaccineId) } : p));
    addToast('Deleted vaccine record', 'info');
  }, [addToast]);

  const toggleChecklist = useCallback((petId, updatedCompletedIds) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, completedChecklistIds: updatedCompletedIds } : p));
  }, []);

  const addDocument = useCallback((petId, newDoc) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, documents: [newDoc, ...(p.documents || [])] } : p));
    addToast('Document stored in vault', 'success');
  }, [addToast]);

  const deleteDocument = useCallback((petId, docId) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, documents: (p.documents || []).filter(d => d.id !== docId) } : p));
    addToast('Document removed from vault', 'info');
  }, [addToast]);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
    addToast('Signed out of account', 'info');
  }, [addToast]);

  return {
    pets,
    activePet,
    activePetId,
    setActivePetId,
    currentUser,
    toasts,
    addToast,
    dismissToast,
    handleAuthSuccess,
    addPet,
    updatePet,
    importSharedPet,
    addVaccine,
    deleteVaccine,
    toggleChecklist,
    addDocument,
    deleteDocument,
    logout
  };
}
