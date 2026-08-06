import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, Share2, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { syncService } from '../services/syncService';

export default function AuthModal({ onClose, onAuthSuccess, onSharedPetImport }) {
  const [activeMode, setActiveMode] = useState('login'); // 'login', 'signup', 'share'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shareCodeInput, setShareCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');
    try {
      const isSignUp = activeMode === 'signup';
      const user = await authService.registerOrLoginEmail(email, password, isSignUp);
      if (user) {
        onAuthSuccess(user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (provider) => {
    setLoading(true);
    setError('');
    try {
      const user = await authService.loginWithOAuthProvider(provider);
      if (user) {
        onAuthSuccess(user);
        onClose();
      }
    } catch (err) {
      setError(err.message || `Failed to complete ${provider} authorization.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemShareCode = async (e) => {
    e.preventDefault();
    if (!shareCodeInput) return;

    setLoading(true);
    setError('');
    try {
      const sharedPet = await syncService.redeemShareCode(shareCodeInput);
      onSharedPetImport(sharedPet);
      onClose();
    } catch (err) {
      setError('Invalid or expired family share code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
              {activeMode === 'share' ? 'Import Shared Pet Passport' : activeMode === 'signup' ? 'Create Persistent Account' : 'Cloud Sync Sign In'}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              {activeMode === 'share' ? 'Enter family access code from spouse or vet' : 'Persistent pet records synced across Web, iPhone & Android'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-elevated)',
          padding: 4,
          borderRadius: 12,
          marginBottom: 20,
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => { setActiveMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 8,
              background: activeMode === 'login' ? 'var(--color-brand-primary)' : 'transparent',
              color: activeMode === 'login' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveMode('signup'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 8,
              background: activeMode === 'signup' ? 'var(--color-brand-primary)' : 'transparent',
              color: activeMode === 'signup' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setActiveMode('share'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 8,
              background: activeMode === 'share' ? 'var(--color-brand-accent)' : 'transparent',
              color: activeMode === 'share' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Family Code
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--color-rose)',
            color: 'var(--color-rose)',
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: '0.82rem',
            marginBottom: 16
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Family Share Code Redemption */}
        {activeMode === 'share' ? (
          <form onSubmit={handleRedeemShareCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                Enter 6-Digit Family Share Code
              </label>
              <input
                type="text"
                placeholder="e.g. PASS-SHARE-981245"
                value={shareCodeInput}
                onChange={e => setShareCodeInput(e.target.value.toUpperCase())}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.05em'
                }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Verifying Code...' : 'Import Shared Pet Passport ➔'}
            </button>
          </form>
        ) : (
          /* OAuth & Email Password Form */
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => handleProviderLogin('apple')}
                disabled={loading}
                style={{
                  background: '#000',
                  color: '#fff',
                  border: '1px solid #333',
                  padding: '10px 16px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: 8
                }}
              >
                <span></span> Sign in with Apple
              </button>

              <button
                type="button"
                onClick={() => handleProviderLogin('google')}
                disabled={loading}
                style={{
                  background: '#fff',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  padding: '10px 16px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: 8
                }}
              >
                <span>🌐</span> Sign in with Google
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '16px 0',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
              <span style={{ padding: '0 10px' }}>OR WITH EMAIL</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            </div>

            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>
                {loading ? 'Authenticating...' : activeMode === 'signup' ? 'Create Account & Save Pets' : 'Sign In & Load Pets'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
