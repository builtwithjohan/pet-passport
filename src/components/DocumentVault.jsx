import React, { useState } from 'react';
import { FileText, Upload, Plus, Trash2, CheckCircle2, Phone, Mail, User, ShieldCheck } from 'lucide-react';

export default function DocumentVault({ pet, onAddDocument, onDeleteDocument }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('USDA Health Cert');

  if (!pet) return null;

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!docName) return;

    onAddDocument(pet.id, {
      id: 'doc-' + Date.now(),
      name: docName,
      type: docType,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'Verified',
      fileSize: '1.4 MB'
    });

    setShowUploadModal(false);
    setDocName('');
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
            Pet Travel Document Vault
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
            Secure digital vault for USDA/DEFRA health certs, microchip papers, and vet endorsements
          </p>
        </div>

        <button onClick={() => setShowUploadModal(true)} className="btn-primary">
          <Upload size={18} /> Upload Document
        </button>
      </div>

      {/* Attending Vet Quick Contact Card */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 24, border: '1px solid var(--border-color-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'var(--color-brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#fff'
          }}>
            <User size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Licensed Veterinarian of Record
            </span>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
              {pet.veterinarian?.name || 'Dr. Sarah Jenkins, DVM'}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {pet.veterinarian?.clinic} • License #{pet.veterinarian?.license}
            </p>
          </div>
          
          <a 
            href={`tel:${pet.veterinarian?.phone}`} 
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <Phone size={16} /> Call Vet
          </a>
        </div>
      </div>

      {/* Documents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {pet.documents.map((doc) => (
          <div key={doc.id} className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={28} color="var(--color-brand-accent)" />
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{doc.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.type} • {doc.fileSize}</span>
                </div>
              </div>
              <span className="badge badge-valid">{doc.status}</span>
            </div>

            <div style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}>
              <span>Added: {doc.dateAdded}</span>
              <button
                onClick={() => onDeleteDocument(pet.id, doc.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-rose)', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--text-primary)' }}>
              Upload Pet Travel Document
            </h3>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. USDA Health Certificate, Rabies Tag Record"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="USDA Health Cert">USDA / Official Health Certificate</option>
                  <option value="Rabies Record">Rabies Vaccine Certificate</option>
                  <option value="Microchip Cert">Microchip Registration Paper</option>
                  <option value="FAVN Lab Results">FAVN Titre Laboratory Report</option>
                  <option value="Import Permit">Country Import Permit</option>
                </select>
              </div>

              <div style={{
                border: '2px dashed var(--border-color-glow)',
                borderRadius: 14,
                padding: 24,
                textAlign: 'center',
                background: 'rgba(99, 102, 241, 0.05)',
                cursor: 'pointer'
              }}>
                <Upload size={32} color="var(--color-brand-primary)" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Drag & Drop PDF or Photo here
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  Supports PDF, JPG, PNG up to 10MB
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
