import React, { useState } from 'react';
import { DEFAULT_CHECKLIST } from '../data/checklistData';
import { CheckSquare, Square, ShieldCheck, Sparkles, Filter, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TravelChecklist({ pet, onToggleChecklist }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!pet) return null;

  const completedIds = pet.completedChecklistIds || [];

  // Calculate total items
  let allItems = [];
  DEFAULT_CHECKLIST.forEach(group => {
    allItems = [...allItems, ...group.items];
  });

  const totalCount = allItems.length;
  const completedCount = allItems.filter(item => completedIds.includes(item.id)).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (itemId) => {
    const nextCompleted = completedIds.includes(itemId)
      ? completedIds.filter(id => id !== itemId)
      : [...completedIds, itemId];

    // Trigger confetti if reaching 100%
    if (nextCompleted.length === totalCount && completedIds.length < totalCount) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    onToggleChecklist(pet.id, nextCompleted);
  };

  const categories = ['ALL', 'Identification', 'Documentation', 'Airline', 'Vaccination', 'Equipment', 'Anxiety Relief', 'Health', 'Packing'];

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header Banner & Readiness Progress */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0 }}>
          Stress-Relief Pet Travel Checklist & Countdown
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
          Step-by-step 120-day timeline designed to eliminate pet travel panic and guarantee smooth customs clearance
        </p>
      </div>

      {/* Readiness Score Progress Bar */}
      <div className="glass-panel" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--border-color-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={26} color="var(--color-emerald)" />
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                {pet.name}'s Travel Readiness Score: {progressPercent}%
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {completedCount} of {totalCount} tasks completed
              </span>
            </div>
          </div>

          <span className={`badge ${progressPercent >= 80 ? 'badge-valid' : 'badge-warning'}`} style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
            {progressPercent === 100 ? '🎉 100% FLIGHT READY!' : progressPercent >= 50 ? 'PROGRESSING WELL' : 'GETTING STARTED'}
          </span>
        </div>

        {/* Progress Bar track */}
        <div style={{
          width: '100%',
          height: 12,
          background: 'var(--bg-surface-elevated)',
          borderRadius: 10,
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 50%, #6366F1 100%)',
            borderRadius: 10,
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 24 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'var(--color-brand-primary)' : 'var(--bg-surface-elevated)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${selectedCategory === cat ? 'var(--color-brand-primary)' : 'var(--border-color)'}`,
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Timeline Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {DEFAULT_CHECKLIST.map((group) => {
          // Filter items by category if selected
          const filteredItems = selectedCategory === 'ALL'
            ? group.items
            : group.items.filter(item => item.category === selectedCategory);

          if (filteredItems.length === 0) return null;

          const groupCompleted = group.items.every(i => completedIds.includes(i.id));

          return (
            <div key={group.id} className="glass-panel" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock size={20} color="var(--color-brand-accent)" />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
                      {group.timeline}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Phase: {group.phase}
                    </span>
                  </div>
                </div>

                <span className="badge badge-info">{group.stressTag}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredItems.map(item => {
                  const isChecked = completedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggle(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 14,
                        padding: 14,
                        borderRadius: 14,
                        background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                        border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <button style={{
                        background: 'transparent',
                        border: 'none',
                        color: isChecked ? 'var(--color-emerald)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 0,
                        marginTop: 2
                      }}>
                        {isChecked ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)',
                            textDecoration: isChecked ? 'line-through' : 'none'
                          }}>
                            {item.title}
                          </span>
                          <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{item.category}</span>
                        </div>
                        <p style={{
                          margin: '4px 0 0 0',
                          fontSize: '0.84rem',
                          color: 'var(--text-secondary)'
                        }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
