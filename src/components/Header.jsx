import React from 'react';
import { ShieldCheck, Smartphone, Monitor, Moon, Sun, Plus, Compass, Dog, Cat, FileCheck, Plane } from 'lucide-react';
import UserAccountBar from './UserAccountBar';

export default function Header({ 
  pets, 
  activePetId, 
  setActivePetId, 
  viewMode, 
  setViewMode, 
  theme, 
  setTheme, 
  onOpenAddPet,
  activeTab,
  setActiveTab,
  readinessScore,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const activePet = pets.find(p => p.id === activePetId) || pets[0];

  return (
    <header style={{
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        
        {/* Brand & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'var(--color-brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Plane size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>Pet Passport</h1>
              <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Web • iOS • Android</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Zero-Anxiety Pet Travel, Vaccination Records & Global Country Compliance
            </p>
          </div>
        </div>

        {/* Pet Switcher & Readiness Badge */}
        {activePet && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Active Pet Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-surface-elevated)',
              padding: '6px 14px',
              borderRadius: 24,
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '1.1rem' }}>
                {activePet.species.toLowerCase().includes('cat') ? '🐱' : '🐶'}
              </span>
              <select
                value={activePetId}
                onChange={(e) => setActivePetId(e.target.value)}
                style={{
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {pets.map(p => (
                  <option key={p.id} value={p.id} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                    {p.name} ({p.breed})
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Readiness Score Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: readinessScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${readinessScore >= 80 ? '#10B981' : '#F59E0B'}`,
              padding: '6px 14px',
              borderRadius: 24,
              fontSize: '0.82rem',
              fontWeight: 700,
              color: readinessScore >= 80 ? '#10B981' : '#F59E0B'
            }}>
              <ShieldCheck size={16} />
              <span>Travel Shield: {readinessScore}% Ready</span>
            </div>

            <button 
              onClick={onOpenAddPet}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              title="Add New Pet"
            >
              <Plus size={16} />
              <span>Add Pet</span>
            </button>
          </div>
        )}

        {/* User Account & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* User Account Bar & Pet Share */}
          <UserAccountBar
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onLogout={onLogout}
            activePet={activePet}
          />

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn-secondary"
            style={{ padding: '8px', borderRadius: 10 }}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#4F46E5" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav style={{
        maxWidth: 1280,
        margin: '12px auto 0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4
      }}>
        {[
          { id: 'passport', label: 'Pet Passport', icon: ShieldCheck },
          { id: 'vaccines', label: 'Vaccines & Health', icon: FileCheck },
          { id: 'countries', label: 'Country Rules', icon: Compass },
          { id: 'airlines', label: 'Airline Rules & Crate Calc', icon: Plane },
          { id: 'checklist', label: 'Stress-Free Checklist', icon: ShieldCheck },
          { id: 'vault', label: 'Document Vault', icon: FileCheck },
          { id: 'anxiety', label: 'Anxiety Relief Hub', icon: Compass }
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'var(--color-brand-primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none'
              }}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
