import React, { useState } from 'react';
import { COUNTRIES, RABIES_HIGH_RISK_COUNTRIES } from '../data/countriesData';
import { BRACHYCEPHALIC_BREEDS } from '../data/airlinesData';
import { Compass, AlertTriangle, CheckCircle, ExternalLink, ShieldAlert, ArrowRight, Info, HelpCircle } from 'lucide-react';

export default function CountryRulesWizard({ pet }) {
  const [origin, setOrigin] = useState(pet?.originCountry || 'USA');
  const [destinationId, setDestinationId] = useState(pet?.destinationCountry || 'EU');
  const [petBreed, setPetBreed] = useState(pet?.breed || 'Golden Retriever');

  const destination = COUNTRIES.find(c => c.id === destinationId || c.code === destinationId) || COUNTRIES[0];
  const isHighRiskOrigin = RABIES_HIGH_RISK_COUNTRIES.includes(origin);

  // Banned breed check
  const isBannedInDestination = destination.prohibitedBreeds.some(b => 
    petBreed.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(petBreed.toLowerCase())
  );

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', margin: 0 }}>
          Global Country Entry Rules & Document Wizard
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
          Select departure origin and destination to generate step-by-step entry protocols & quarantine risk assessment
        </p>
      </div>

      {/* Origin -> Destination Selector */}
      <div className="glass-panel" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, alignItems: 'center' }}>
          
          {/* Origin Country */}
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Departure Origin Country
            </label>
            <select
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
            >
              <option value="USA">🇺🇸 United States of America</option>
              <option value="EU">🇪🇺 European Union (Schengen)</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="IND">🇮🇳 India (AQCS NOC Rules)</option>
              <option value="SGP">🇸🇬 Singapore (AVS Biosecurity)</option>
              <option value="JPN">🇯🇵 Japan (MAFF AQS 180-Day Rule)</option>
              <option value="AUS">🇦🇺 Australia (DAFF PEQ Rules)</option>
              <option value="NZL">🇳🇿 New Zealand (MPI Biosecurity)</option>
              <option value="FJI">🇫🇯 Fiji (BAF Island Biosecurity)</option>
              <option value="THA">🇹🇭 Thailand (DLD Suvarnabhumi)</option>
              <option value="KOR">🇰🇷 South Korea (APQA Incheon)</option>
              <option value="MYS">🇲🇾 Malaysia (DVS KLIA)</option>
              <option value="HKG">🇭🇰 Hong Kong SAR (AFCD Group 1-3)</option>
              <option value="CAN">🇨🇦 Canada (CFIA)</option>
              <option value="UAE">🇦🇪 United Arab Emirates (MOCCAE)</option>
              <option value="Brazil">🇧🇷 Brazil (Rabies High-Risk)</option>
              <option value="Mexico">🇲🇽 Mexico (Rabies High-Risk)</option>
            </select>
          </div>

          <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--color-brand-primary)' }}>
            ➔
          </div>

          {/* Destination Country */}
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Destination Country
            </label>
            <select
              value={destinationId}
              onChange={e => setDestinationId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
            >
              {COUNTRIES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pet Breed Check */}
          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Pet Breed (Restriction Check)
            </label>
            <input
              type="text"
              value={petBreed}
              onChange={e => setPetBreed(e.target.value)}
              placeholder="e.g. Golden Retriever, Pitbull, Pug"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Banned Breed Warning */}
      {isBannedInDestination && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid var(--color-rose)',
          padding: 20,
          borderRadius: 16,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16
        }}>
          <ShieldAlert size={28} color="var(--color-rose)" />
          <div>
            <h4 style={{ color: 'var(--color-rose)', fontSize: '1.1rem', margin: 0 }}>
              RESTRICTED / BANNED BREED ALERT FOR {destination.name.toUpperCase()}
            </h4>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
              The breed <strong>"{petBreed}"</strong> matches entry restrictions or outright import bans in {destination.name}. Please review local customs authority policies or check with a certified pet relocator prior to travel.
            </p>
          </div>
        </div>
      )}

      {/* Destination Rules Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        
        {/* 1. Microchip Requirement */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>🏷️</span>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Microchip Standard</h4>
              <span className={`badge ${destination.microchip.required ? 'badge-valid' : 'badge-info'}`}>
                {destination.microchip.required ? 'MANDATORY' : 'RECOMMENDED'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
            <strong>Standard:</strong> {destination.microchip.standard}
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', padding: 10, borderRadius: 8 }}>
            💡 {destination.microchip.notes}
          </div>
        </div>

        {/* 2. Rabies Vaccination & Waiting Window */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>💉</span>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Rabies Vaccine & Waiting</h4>
              <span className="badge badge-valid">
                {destination.rabies.waitingPeriodDays > 0 ? `${destination.rabies.waitingPeriodDays}-DAY WAIT` : 'NO WAIT'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
            <strong>Min Age:</strong> {destination.rabies.minAge}
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', padding: 10, borderRadius: 8 }}>
            💡 {destination.rabies.notes}
          </div>
        </div>

        {/* 3. FAVN Rabies Blood Titre Test */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>🩸</span>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>FAVN Blood Titre Test</h4>
              <span className={`badge ${
                (destination.titreTest.requiredForLowRisk || (destination.titreTest.requiredForHighRisk && isHighRiskOrigin))
                  ? 'badge-warning' : 'badge-info'
              }`}>
                {(destination.titreTest.requiredForLowRisk || (destination.titreTest.requiredForHighRisk && isHighRiskOrigin))
                  ? 'REQUIRED FOR ROUTE' : 'NOT REQUIRED'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            {destination.titreTest.details}
          </p>
        </div>

        {/* 4. Tapeworm & Parasite Treatment */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>💊</span>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Tapeworm (Echinococcus)</h4>
              <span className={`badge ${destination.tapewormTreatment.required ? 'badge-warning' : 'badge-info'}`}>
                {destination.tapewormTreatment.required ? 'TIME-CRITICAL' : 'NOT APPLICABLE'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
            <strong>Window:</strong> {destination.tapewormTreatment.timing}
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Ingredient: {destination.tapewormTreatment.ingredient}
          </div>
        </div>

        {/* 5. Official Health Cert & USDA/DEFRA Endorsement */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>📜</span>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Official Health Certificate</h4>
              <span className="badge badge-valid">10-DAY VALIDITY</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>
            <strong>Form Name:</strong> {destination.healthCert.name}
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {destination.healthCert.validity}
          </div>
        </div>

        {/* 6. Mandatory Quarantine Risk Assessment */}
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>🏥</span>
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>Quarantine Requirement</h4>
              <span className={`badge ${destination.quarantine.includes('0 days') ? 'badge-valid' : 'badge-danger'}`}>
                {destination.quarantine.includes('0 days') ? '0-DAY QUARANTINE' : 'MANDATORY STAY'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
            {destination.quarantine}
          </p>
          
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Verified: <strong>{destination.lastVerified || '2026-08'}</strong></span>
            <span>Always verify with official sources</span>
          </div>

          <a
            href={destination.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '8px 12px', width: '100%', justifyContent: 'center', marginTop: 8 }}
          >
            Official Government Portal <ExternalLink size={14} />
          </a>
        </div>

      </div>
    </div>
  );
}
