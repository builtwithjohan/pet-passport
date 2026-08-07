import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PetPassportCard from './components/PetPassportCard';
import VaccineTracker from './components/VaccineTracker';
import CountryRulesWizard from './components/CountryRulesWizard';
import AirlineRulesCalculator from './components/AirlineRulesCalculator';
import TravelChecklist from './components/TravelChecklist';
import DocumentVault from './components/DocumentVault';
import AnxietyReliefHub from './components/AnxietyReliefHub';
import AddPetModal from './components/AddPetModal';
import EditPetModal from './components/EditPetModal';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import { usePets } from './hooks/usePets';
import { computeDestinationReadinessScore } from './utils/vaccineUtils';

export default function App() {
  const {
    pets,
    activePet,
    activePetId,
    setActivePetId,
    currentUser,
    toasts,
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
  } = usePets();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('passport');
  const [theme, setTheme] = useState('dark');
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  // Restore URL hash params on mount & listener
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const params = new URLSearchParams(hash);
      const petFromHash = params.get('pet');
      const tabFromHash = params.get('tab');
      if (petFromHash) {
        setActivePetId(petFromHash);
      }
      if (tabFromHash) {
        setActiveTab(tabFromHash);
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, [setActivePetId]);

  // Update hash when active pet or tab changes
  useEffect(() => {
    if (activePetId && activeTab) {
      window.history.replaceState(null, '', `#pet=${activePetId}&tab=${activeTab}`);
    }
  }, [activePetId, activeTab]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Compute dynamic readiness score based on destination country rules
  const readinessScore = activePet ? computeDestinationReadinessScore(activePet, activePet.destinationCountry) : 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'passport':
        return <PetPassportCard pet={activePet} onTabChange={setActiveTab} onEditPet={setEditingPet} />;
      case 'vaccines':
        return (
          <VaccineTracker 
            pet={activePet} 
            onAddVaccine={addVaccine} 
            onDeleteVaccine={deleteVaccine} 
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
            onToggleChecklist={toggleChecklist} 
          />
        );
      case 'vault':
        return (
          <DocumentVault 
            pet={activePet} 
            onAddDocument={addDocument} 
            onDeleteDocument={deleteDocument} 
          />
        );
      case 'anxiety':
        return <AnxietyReliefHub />;
      default:
        return <PetPassportCard pet={activePet} onTabChange={setActiveTab} onEditPet={setEditingPet} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        pets={pets}
        activePetId={activePetId}
        setActivePetId={setActivePetId}
        theme={theme}
        setTheme={setTheme}
        onOpenAddPet={() => setShowAddPetModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        readinessScore={readinessScore}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={logout}
      />

      {/* Main Native Web Application View */}
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 60px 24px' }}>
          {renderTabContent()}
        </div>
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
          onAddPet={addPet}
        />
      )}

      {/* Edit Pet Modal */}
      {editingPet && (
        <EditPetModal
          pet={editingPet}
          onClose={() => setEditingPet(null)}
          onUpdatePet={updatePet}
        />
      )}

      {/* Auth & Family Sync Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          onSharedPetImport={importSharedPet}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

