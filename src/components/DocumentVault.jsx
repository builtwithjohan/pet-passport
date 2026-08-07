import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Plus, Trash2, CheckCircle2, Phone, Mail, User, ShieldCheck, FileCheck } from 'lucide-react';
import { dbStore } from '../services/dbStore';

export default function DocumentVault({ pet, onAddDocument, onDeleteDocument }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('USDA Health Cert');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSizeFormatted, setFileSizeFormatted] = useState('0 KB');
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showUploadModal) {
        setShowUploadModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showUploadModal]);

  if (!pet) return null;

  const processFile = (file) => {
    if (!file) return;

    // Calculate file size
    const sizeKB = file.size / 1024;
    const formatted = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
    setFileSizeFormatted(formatted);
    setSelectedFile(file);

    if (!docName) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setDocName(nameWithoutExt);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!docName) return;

    const docId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'doc-' + Date.now();

    // Persist heavy binary file blob to IndexedDB to avoid localStorage quota crash
    if (selectedFile) {
      try {
        await dbStore.saveDocumentBlob(docId, selectedFile);
      } catch (err) {
        console.warn('Failed to save document blob to IndexedDB:', err);
      }
    }

    onAddDocument(pet.id, {
      id: docId,
      name: docName,
      type: docType,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'Stored',
      fileSize: fileSizeFormatted !== '0 KB' ? fileSizeFormatted : '1.2 MB'
    });

    setShowUploadModal(false);
    setDocName('');
    setSelectedFile(null);
    setFileSizeFormatted('0 KB');
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
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
            justifyContent: 'center',
            color: '#fff'
          }}>
            <User size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Attending Veterinarian of Record
            </span>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
              {pet.veterinarian?.name || 'Veterinarian Not Assigned'}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {pet.veterinarian?.clinic} • License #{pet.veterinarian?.license}
            </p>
          </div>
          
          {pet.veterinarian?.phone && (
            <a 
              href={`tel:${pet.veterinarian.phone}`} 
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <Phone size={16} /> Call Vet
            </a>
          )}
        </div>
      </div>

      {/* Documents Grid */}
      {pet.documents.length === 0 ? (
        <div className="glass-panel" style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
          <FileText size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontWeight: 600 }}>No travel documents stored yet.</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>Click "Upload Document" to attach health certificates, microchip forms, or lab reports.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {pet.documents.map((doc) => (
            <div key={doc.id} className="glass-panel" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={28} color="var(--color-brand-accent)" />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{doc.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.type} • {doc.fileSize || 'Stored'}</span>
                  </div>
                </div>
                <span className="badge badge-valid">{doc.status || 'Stored'}</span>
              </div>

              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}>
                <span>Added: {doc.dateAdded}</span>
                <button
                  onClick={() => onDeleteDocument(pet.id, doc.id)}
                  aria-label={`Delete ${doc.name}`}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-rose)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16, color: 'var(--text-primary)' }}>
              Upload Pet Travel Document
            </h3>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label htmlFor="doc-title-input" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Document Title
                </label>
                <input
                  id="doc-title-input"
                  type="text"
                  placeholder="e.g. USDA Health Certificate Annex IV"
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
                <label htmlFor="doc-type-select" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Document Type
                </label>
                <select
                  id="doc-type-select"
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

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: isDragging ? '2px dashed var(--color-brand-accent)' : '2px dashed var(--border-color-glow)',
                  borderRadius: 14,
                  padding: 24,
                  textAlign: 'center',
                  background: isDragging ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.05)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, border-color 0.2s ease'
                }}
              >
                {selectedFile ? (
                  <>
                    <FileCheck size={32} color="var(--color-emerald)" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-emerald)', marginTop: 2 }}>
                      File selected ({fileSizeFormatted})
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={32} color="var(--color-brand-primary)" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Drag & Drop PDF or Photo here (or click to browse)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      Supports PDF, JPG, PNG up to 10MB
                    </div>
                  </>
                )}
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

