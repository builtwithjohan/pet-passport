import React, { useState } from 'react';
import { Syringe, Plus, Calendar, AlertCircle, CheckCircle2, ShieldAlert, Award, FileText } from 'lucide-react';

export default function VaccineTracker({ pet, onAddVaccine, onDeleteVaccine }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateAdministered: '',
    dateExpires: '',
    batch: '',
    vet: pet?.veterinarian?.name || ''
  });

  if (!pet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dateAdministered || !formData.dateExpires) return;
    
    // Auto status calculation based on expiry date
    const today = new Date();
    const expiry = new Date(formData.dateExpires);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let status = 'valid';
    if (diffDays < 0) status = 'expired';
    else if (diffDays <= 30) status = 'warning';

    onAddVaccine(pet.id, {
      id: 'v-' + Date.now(),
      ...formData,
      status
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      dateAdministered: '',
      dateExpires: '',
      batch: '',
      vet: pet?.veterinarian?.name || ''
    });
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0 }}>
            Vaccination & Titre Health Log
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Rabies boosters, core immunizations, and FAVN blood antibody titre tests for {pet.name}
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={18} /> Add Vaccine Record
        </button>
      </div>

      {/* Vaccine Records List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {pet.vaccinations.map((vac) => {
          const isWarning = vac.status === 'warning';
          const isExpired = vac.status === 'expired';

          return (
            <div 
              key={vac.id} 
              className="glass-panel"
              style={{
                padding: 20,
                borderLeft: `4px solid ${
                  isExpired ? 'var(--color-rose)' : isWarning ? 'var(--color-amber)' : 'var(--color-emerald)'
                }`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0 }}>{vac.name}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Batch / Serial: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{vac.batch || 'N/A'}</span>
                  </div>
                </div>
                
                <span className={`badge badge-${vac.status}`}>
                  {vac.status.toUpperCase()}
                </span>
              </div>

              <div style={{
                margin: '16px 0',
                padding: 12,
                background: 'var(--bg-surface-elevated)',
                borderRadius: 12,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                fontSize: '0.82rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Administered</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{vac.dateAdministered}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Expires On</span>
                  <strong style={{ color: isExpired ? 'var(--color-rose)' : isWarning ? 'var(--color-amber)' : 'var(--color-emerald)' }}>
                    {vac.dateExpires}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>Vet: <strong>{vac.vet || 'Licensed Vet'}</strong></span>
                <button
                  onClick={() => onDeleteVaccine(pet.id, vac.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-rose)',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  Delete
                </button>
              </div>

              {isWarning && (
                <div style={{
                  marginTop: 12,
                  padding: '8px 12px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  color: 'var(--color-amber)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <AlertCircle size={14} /> Expiring soon! Schedule booster before international departure.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Vaccine Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--text-primary)' }}>
              Add Vaccination / Titre Test Record
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Vaccine / Test Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rabies 3-Year, DHPP, or FAVN Rabies Titre Test"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Date Administered
                  </label>
                  <input
                    type="date"
                    value={formData.dateAdministered}
                    onChange={e => setFormData({ ...formData, dateAdministered: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.dateExpires}
                    onChange={e => setFormData({ ...formData, dateExpires: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Batch / Lot Serial Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. RB-90821-X"
                  value={formData.batch}
                  onChange={e => setFormData({ ...formData, batch: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Administering Veterinarian
                </label>
                <input
                  type="text"
                  placeholder="Dr. Name / Clinic"
                  value={formData.vet}
                  onChange={e => setFormData({ ...formData, vet: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Vaccine Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
