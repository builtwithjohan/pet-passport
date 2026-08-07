import React, { useState } from 'react';
import { AIRLINES, BRACHYCEPHALIC_BREEDS } from '../data/airlinesData';
import { Plane, AlertTriangle, CheckCircle, Calculator, Thermometer, ShieldAlert, DollarSign, Info } from 'lucide-react';

export default function AirlineRulesCalculator({ pet }) {
  const [selectedAirlineId, setSelectedAirlineId] = useState('delta');
  
  // Fit Calculator Inputs
  const [petWeightKg, setPetWeightKg] = useState(pet?.weightKg || 8);
  const [petHeightCm, setPetHeightCm] = useState(25); // Height at shoulder
  const [carrierLengthCm, setCarrierLengthCm] = useState(44);
  const [carrierWidthCm, setCarrierWidthCm] = useState(28);
  const [carrierHeightCm, setCarrierHeightCm] = useState(24);
  const [carrierType, setCarrierType] = useState('soft'); // 'soft' or 'hard'
  const [breedInput, setBreedInput] = useState(pet?.breed || 'Golden Retriever');

  const selectedAirline = AIRLINES.find(a => a.id === selectedAirlineId) || AIRLINES[0];

  // Brachycephalic (Snub-nosed) check
  const isSnubNosed = BRACHYCEPHALIC_BREEDS.some(b => 
    breedInput.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(breedInput.toLowerCase())
  );

  // Calculation Logic
  const maxAllowedWeight = selectedAirline.maxCabinWeightKg;
  const isWeightCompliant = selectedAirline.inCabinAllowed && petWeightKg <= maxAllowedWeight;

  const maxDims = carrierType === 'soft' 
    ? selectedAirline.softCarrierMaxDimsCm 
    : selectedAirline.hardCarrierMaxDimsCm;

  const isDimensionsCompliant = 
    carrierLengthCm <= maxDims.length &&
    carrierWidthCm <= maxDims.width &&
    carrierHeightCm <= maxDims.height;

  // Pet height clearance inside carrier check (pet shoulder height must be less than carrier height for comfortable standing)
  const isPetComfortable = petHeightCm <= (carrierHeightCm + 3);

  const isInCabinApproved = isWeightCompliant && isDimensionsCompliant && isPetComfortable;

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0 }}>
          Airline Pet Policy Database & Interactive Carrier Calculator
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
          Compare major airline rules, cabin vs cargo weight limits, and test your carrier crate dimensions in real-time
        </p>
      </div>

      {/* Select Airline Bar */}
      <div style={{
        display: 'flex',
        gap: 12,
        overflowX: 'auto',
        paddingBottom: 12,
        marginBottom: 24
      }}>
        {AIRLINES.map(airline => {
          const isSelected = airline.id === selectedAirlineId;
          return (
            <button
              key={airline.id}
              onClick={() => setSelectedAirlineId(airline.id)}
              style={{
                background: isSelected ? 'var(--color-brand-gradient)' : 'var(--bg-glass)',
                color: isSelected ? '#fff' : 'var(--text-primary)',
                border: `1px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--border-color)'}`,
                padding: '12px 20px',
                borderRadius: 16,
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{airline.logo}</span>
              <span>{airline.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        
        {/* Left Column: Airline Policy Summary */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: 6 }}>{selectedAirline.code} POLICY</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>{selectedAirline.name}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PET FEE (ONE-WAY)</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-emerald)' }}>
                ${selectedAirline.feeInCabinUSD} - ${selectedAirline.feeInternationalUSD}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Cabin Status Pill */}
            <div style={{
              padding: 14,
              borderRadius: 12,
              background: selectedAirline.inCabinAllowed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
              border: `1px solid ${selectedAirline.inCabinAllowed ? 'var(--color-emerald)' : 'var(--color-rose)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>In-Cabin Travel</span>
              <span className={`badge ${selectedAirline.inCabinAllowed ? 'badge-valid' : 'badge-danger'}`}>
                {selectedAirline.inCabinAllowed ? `ALLOWED (MAX ${selectedAirline.maxCabinWeightKg} KG / ${selectedAirline.maxCabinWeightLbs} LBS)` : 'NOT PERMITTED'}
              </span>
            </div>

            {/* Max Carrier Dims Box */}
            {selectedAirline.inCabinAllowed && (
              <div style={{
                background: 'var(--bg-surface-elevated)',
                padding: 14,
                borderRadius: 12,
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--color-brand-accent)', marginBottom: 6 }}>
                  📏 Max Soft Carrier Dimensions:
                </div>
                <div>
                  <strong>{selectedAirline.softCarrierMaxDimsCm.length} cm</strong> (L) x <strong>{selectedAirline.softCarrierMaxDimsCm.width} cm</strong> (W) x <strong>{selectedAirline.softCarrierMaxDimsCm.height} cm</strong> (H)
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>
                  ({selectedAirline.softCarrierMaxDimsIn.length}" x {selectedAirline.softCarrierMaxDimsIn.width}" x {selectedAirline.softCarrierMaxDimsIn.height}")
                </div>
              </div>
            )}

            {/* Temperature & Weather Restrictions */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: 14,
              borderRadius: 12,
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--color-amber)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Thermometer size={16} /> Temperature Restrictions:
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {selectedAirline.temperatureRestrictions}
              </p>
            </div>

            {/* Snub-Nosed Policy */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              padding: 14,
              borderRadius: 12,
              border: '1px solid var(--border-color)',
              fontSize: '0.82rem'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--color-rose)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <ShieldAlert size={16} /> Snub-Nosed / Brachycephalic Policy:
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {selectedAirline.snubNosedPolicy}
              </p>
            </div>

            {/* Reservation Window */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <strong>Reservation Window:</strong> {selectedAirline.bookingNoticeWindow}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Carrier & Pet Size Verification Calculator */}
        <div className="glass-panel" style={{ padding: 24, border: '1px solid var(--border-color-glow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Calculator size={22} color="var(--color-brand-primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
              Live Carrier & Pet Fit Verification
            </h3>
          </div>

          {/* Calculator Inputs Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Pet Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={petWeightKg}
                  onChange={e => setPetWeightKg(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontWeight: 700
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Pet Height at Shoulder (cm)
                </label>
                <input
                  type="number"
                  value={petHeightCm}
                  onChange={e => setPetHeightCm(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontWeight: 700
                  }}
                />
              </div>
            </div>

            {/* Carrier Dimensions (L x W x H) */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Carrier Outer Dimensions (cm) - L x W x H
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <input
                  type="number"
                  placeholder="Length"
                  value={carrierLengthCm}
                  onChange={e => setCarrierLengthCm(parseFloat(e.target.value) || 0)}
                  style={{ padding: '8px', borderRadius: 8, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
                <input
                  type="number"
                  placeholder="Width"
                  value={carrierWidthCm}
                  onChange={e => setCarrierWidthCm(parseFloat(e.target.value) || 0)}
                  style={{ padding: '8px', borderRadius: 8, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={carrierHeightCm}
                  onChange={e => setCarrierHeightCm(parseFloat(e.target.value) || 0)}
                  style={{ padding: '8px', borderRadius: 8, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Carrier Material & Breed */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Carrier Type
                </label>
                <select
                  value={carrierType}
                  onChange={e => setCarrierType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="soft">Soft-Sided Carrier</option>
                  <option value="hard">Hard Plastic / Kennel</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Breed (Respiratory Safety)
                </label>
                <input
                  type="text"
                  value={breedInput}
                  onChange={e => setBreedInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Calculation Result Banner */}
            <div style={{
              marginTop: 12,
              padding: 16,
              borderRadius: 16,
              background: isInCabinApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${isInCabinApproved ? 'var(--color-emerald)' : 'var(--color-rose)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isInCabinApproved ? (
                  <CheckCircle size={26} color="var(--color-emerald)" />
                ) : (
                  <AlertTriangle size={26} color="var(--color-rose)" />
                )}
                <div>
                  <h4 style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    color: isInCabinApproved ? 'var(--color-emerald)' : 'var(--color-rose)'
                  }}>
                    {isInCabinApproved 
                      ? 'APPROVED FOR IN-CABIN TRAVEL!' 
                      : 'REQUIRES CARGO HOLD OR ENLARGED CRATE'}
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                    {isInCabinApproved 
                      ? `Your pet and carrier meet ${selectedAirline.name} under-seat cabin requirements.`
                      : !selectedAirline.inCabinAllowed
                        ? `${selectedAirline.name} does not allow in-cabin pet travel on international routes.`
                        : !isWeightCompliant 
                          ? `Pet weight (${petWeightKg}kg) exceeds max cabin limit of ${maxAllowedWeight}kg.`
                          : `Carrier dimensions (${carrierLengthCm}x${carrierWidthCm}x${carrierHeightCm}cm) exceed limits (${maxDims.length}x${maxDims.width}x${maxDims.height}cm).`}
                  </p>
                </div>
              </div>

              {isSnubNosed && (
                <div style={{
                  marginTop: 10,
                  padding: '8px 12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  color: 'var(--color-amber)',
                  fontWeight: 600
                }}>
                  ⚠️ Snub-Nosed Breed Note: {breedInput} is a brachycephalic breed. Airlines forbid cargo hold transport during summer months. In-cabin is strongly advised.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
