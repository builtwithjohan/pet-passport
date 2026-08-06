import React, { useState } from 'react';
import { User, LogIn, CloudCheck, CloudOff, Share2, Copy, Check } from 'lucide-react';
import { syncService } from '../services/syncService';

export default function UserAccountBar({ currentUser, onOpenAuth, onLogout, activePet }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const shareCode = activePet ? syncService.generateShareCode(activePet.id) : 'PASS-SHARE-981245';

  const handleCopyShareCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {currentUser ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Pet Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.78rem', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', borderColor: 'rgba(6, 182, 212, 0.3)' }}
            title="Share Pet Passport with Family or Vet"
          >
            <Share2 size={14} /> Family Share
          </button>

          {/* User Profile Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-surface-elevated)',
            padding: '4px 12px 4px 6px',
            borderRadius: 20,
            border: '1px solid var(--border-color)',
            fontSize: '0.82rem'
          }}>
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              style={{ width: 24, height: 24, borderRadius: '50%' }}
            />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</span>
            <CloudCheck size={16} color="var(--color-emerald)" title="Cloud Synced" />
            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                marginLeft: 4
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onOpenAuth}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <LogIn size={15} /> Sign In / Sync
          </button>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 12, color: 'var(--text-primary)' }}>
              Share {activePet?.name || 'Pet'}'s Passport
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Give this 6-digit family code to a spouse, family member, or veterinarian so they can access and sync {activePet?.name}'s live travel records on their own phone or browser!
            </p>

            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: 16,
              borderRadius: 14,
              border: '1px solid var(--border-color-glow)',
              textAlign: 'center',
              marginBottom: 20
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Family Access Invite Code
              </span>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--color-brand-accent)',
                marginTop: 6,
                letterSpacing: '0.08em'
              }}>
                {shareCode}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleCopyShareCode}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                {copiedCode ? 'Code Copied!' : 'Copy Share Code'}
              </button>
              <button onClick={() => setShowShareModal(false)} className="btn-secondary">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
