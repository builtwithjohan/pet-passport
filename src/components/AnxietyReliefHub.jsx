import React from 'react';
import { ANXIETY_TIPS } from '../data/checklistData';
import { Heart, Compass, ShieldCheck, Smile, Volume2, Droplets, Moon, AlertCircle } from 'lucide-react';

export default function AnxietyReliefHub() {
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0 }}>
          Pet Travel Anxiety Relief & Calming Hub
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
          Science-backed protocols to eliminate travel stress, prevent motion sickness, and keep your pet relaxed from takeoff to landing
        </p>
      </div>

      {/* Hero Stress Shield Alert Banner */}
      <div className="glass-panel" style={{
        padding: 24,
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        border: '1px solid var(--border-color-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
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
            <Heart size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
              The Zero-Sedative Calming Guarantee
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
              Veterinarians and the International Air Transport Association (IATA) strongly advise <strong>AGAINST using heavy sedatives</strong> during flights because atmospheric cabin pressure drops can cause severe respiratory and circulatory side effects. Use our natural behavioral conditioning and calming protocol instead!
            </p>
          </div>
        </div>
      </div>

      {/* Anxiety Protocols Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
        {ANXIETY_TIPS.map((section, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '1.6rem' }}>{section.icon}</span>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                {section.title}
              </h3>
            </div>
            
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              {section.summary}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.tips.map((tip, tIdx) => (
                <div 
                  key={tIdx} 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                    background: 'var(--bg-surface-elevated)',
                    padding: 12,
                    borderRadius: 12,
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <Smile size={16} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* TSA Security & Airport Pet Relief Checklist */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 16 }}>
          🛫 Flight Day Airport Protocol & TSA Security Checkpoint
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: 16, borderRadius: 14, border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-brand-accent)', marginBottom: 6 }}>
              1. TSA Security Checkpoint
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Your pet must come OUT of the carrier to walk or be carried through the metal detector with you while the empty carrier goes through the X-ray scanner.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: 16, borderRadius: 14, border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-brand-accent)', marginBottom: 6 }}>
              2. Harness & Leash Safety
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Never remove your pet's harness before TSA. Airport noises can startle pets; keep a firm grip on the leash or use a private screening room if requested.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: 16, borderRadius: 14, border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-brand-accent)', marginBottom: 6 }}>
              3. Airport Pet Relief Areas
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              All major airports (e.g. JFK, LAX, LHR, FRA, DXB) have designated post-security Service Animal / Pet Relief rooms with artificial turf and washing sinks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
