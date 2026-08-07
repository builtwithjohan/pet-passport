import React, { useState, useEffect } from 'react';
import { SAMPLE_PETS } from './data/samplePets';
import { DEFAULT_CHECKLIST } from './data/checklistData';
import Header from './components/Header';
import PetPassportCard from './components/PetPassportCard';
import VaccineTracker from './components/VaccineTracker';
import CountryRulesWizard from './components/CountryRulesWizard';
import AirlineRulesCalculator from './components/AirlineRulesCalculator';
import TravelChecklist from './components/TravelChecklist';
import DocumentVault from './components/DocumentVault';
import AnxietyReliefHub from './components/AnxietyReliefHub';
import AddPetModal from './components/AddPetModal';
import AuthModal from './components/AuthModal';
import { authService } from './services/authService';
import { syncService } from './services/syncService';
import { computeDestinationReadinessScore } from './utils/vaccineUtils';
import { Smartphone, Monitor, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('passport');
  const [viewMode, setViewMode] = useState('desktop');
  const [theme, setTheme] = useState('dark');
  const [showAddPetModal, setShowAddPetModal] = useState(false);

  // Restore user session & user-specific pets on mount
  useEffect(() => {
    async function restoreSession() {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const userPets = await syncService.getUserPets(user.id);
        if (userPets && userPets.length > 0) {
          setPets(userPets);
          setActivePetId(userPets[0].id);
        }
      }
    }
    restoreSession();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pet_passport_pets', JSON.stringify(pets));
    } catch (err) {
      console.warn('Failed to persist pets to localStorage:', err);
    }

    if (currentUser) {
      // Only sync non-sample pets to user account
      const userPetsToSync = pets.filter(p => !p.isSample);
      if (userPetsToSync.length > 0) {
        syncService.syncToCloud(currentUser, userPetsToSync);
      }
    }
  }, [pets, currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const activePet = pets.find(p => p.id === activePetId) || pets[0];

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    const userPets = await syncService.getUserPets(user.id);
    if (userPets && userPets.length > 0) {
      setPets(userPets);
      setActivePetId(userPets[0].id);
    } else {
      // Only migrate real user-created pets (exclude demo sample pets)
      const userCreatedPets = pets.filter(p => !p.isSample).map(p => ({ ...p, ownerId: user.id }));
      if (userCreatedPets.length > 0) {
        setPets(userCreatedPets);
        await syncService.syncToCloud(user, userCreatedPets);
      }
    }
  };

  const handleAddPet = (newPet) => {
    setPets(prev => [...prev, newPet]);
    setActivePetId(newPet.id);
  };

  const handleSharedPetImport = (sharedPet) => {
    setPets(prev => [sharedPet, ...prev]);
    setActivePetId(sharedPet.id);
  };

  const handleAddVaccine = (petId, newVaccine) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, vaccinations: [newVaccine, ...(p.vaccinations || [])] } : p));
  };

  const handleDeleteVaccine = (petId, vaccineId) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, vaccinations: (p.vaccinations || []).filter(v => v.id !== vaccineId) } : p));
  };

  const handleToggleChecklist = (petId, updatedCompletedIds) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, completedChecklistIds: updatedCompletedIds } : p));
  };

  const handleAddDocument = (petId, newDoc) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, documents: [newDoc, ...(p.documents || [])] } : p));
  };

  const handleDeleteDocument = (petId, docId) => {
    setPets(prev => prev.map(p => p.id === petId ? { ...p, documents: (p.documents || []).filter(d => d.id !== docId) } : p));
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  // Compute dynamic readiness score based on destination country rules
  const readinessScore = activePet ? computeDestinationReadinessScore(activePet, activePet.destinationCountry) : 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'passport':
        return <PetPassportCard pet={activePet} onTabChange={setActiveTab} />;
      case 'vaccines':
        return (
          <VaccineTracker 
            pet={activePet} 
            onAddVaccine={handleAddVaccine} 
            onDeleteVaccine={handleDeleteVaccine} 
          />
        );
      case 'countries':
        return <CountryRulesWizard pet={activePet} />;
      case 'airlines':
        return <AirlineRulesCalculator pet={activePet} />;
      case 'checklist':
        return (
          <TravelChecklist 
            pet={activePet} 
            onToggleChecklist={handleToggleChecklist} 
          />
        );
      case 'vault':
        return (
          <DocumentVault 
            pet={activePet} 
            onAddDocument={handleAddDocument} 
            onDeleteDocument={handleDeleteDocument} 
          />
        );
      case 'anxiety':
        return <AnxietyReliefHub />;
      default:
        return <PetPassportCard pet={activePet} onTabChange={setActiveTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        pets={pets}
        activePetId={activePetId}
        setActivePetId={setActivePetId}
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        setTheme={setTheme}
        onOpenAddPet={() => setShowAddPetModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        readinessScore={readinessScore}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Body View (Desktop vs Responsive Compact View) */}
      <main style={{ flex: 1 }}>
        {viewMode === 'mobile' ? (
          <div className="device-frame-container">
            <div className="device-frame-mobile">
              <div className="mobile-notch" />
              <div className="mobile-scroll-body" style={{ padding: '32px 16px' }}>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: 12,
                  background: 'var(--color-brand-gradient)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: 16,
                  textAlign: 'center'
                }}>
                  📱 Mobile Viewport Preview Mode
                </div>
                {renderTabContent()}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px 24px' }}>
            {renderTabContent()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        background: 'var(--bg-surface)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <strong>Pet Passport</strong> • Comprehensive Pet Travel Checklist & Vaccination Tracker
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Based on published CDC, EU & DEFRA public guidance</span>
            <span>Always verify with official government sources</span>
          </div>
        </div>
      </footer>

      {/* Add Pet Modal */}
      {showAddPetModal && (
        <AddPetModal
          onClose={() => setShowAddPetModal(false)}
          onAddPet={handleAddPet}
        />
      )}

      {/* Auth & Family Sync Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          onSharedPetImport={handleSharedPetImport}
        />
      )}
    </div>
  );
}

