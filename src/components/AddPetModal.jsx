import React, { useState, useEffect } from 'react';
import { Plus, X, Dog, Cat, Camera } from 'lucide-react';
import { dbStore } from '../services/dbStore';

export default function AddPetModal({ onClose, onAddPet }) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('Male (Neutered)');
  const [weightKg, setWeightKg] = useState('8.5');
  const [dob, setDob] = useState('2022-06-01');
  const [microchipId, setMicrochipId] = useState('985141009988221');
  const [color, setColor] = useState('Golden / Brown');
  const [originCountry, setOriginCountry] = useState('USA');
  const [destinationCountry, setDestinationCountry] = useState('EU');

  // Photo state
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !breed || !microchipId) return;

    const defaultPhoto = species.toLowerCase().includes('cat')
      ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

    const petId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'pet-' + Date.now();
    const vacId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'v-' + Date.now();

    if (selectedPhotoFile) {
      try {
        await dbStore.savePetPhotoBlob(petId, selectedPhotoFile);
      } catch (err) {
        console.warn('Failed to save pet photo blob:', err);
      }
    }

    onAddPet({
      id: petId,
      name,
      species,
      breed,
      sex,
      weightKg: parseFloat(weightKg) || 5,
      dob,
      microchipId,
      microchipDate: new Date().toISOString().split('T')[0],
      color,
      originCountry,
      destinationCountry,
      photoUrl: photoPreview || defaultPhoto,
      passportNumber: `PET-${originCountry.substring(0,2)}-${Math.floor(1000 + Math.random() * 9000)}-${name.substring(0,2).toUpperCase()}`,
      veterinarian: {
        name: 'Dr. Sarah Jenkins, DVM',
        clinic: 'Metropolitan Pet Hospital',
        phone: '+1 (555) 234-5678',
        license: 'VET-8891'
      },
      vaccinations: [
        {
          id: vacId,
          name: 'Rabies Primary Vaccine (15-Digit ISO Microchip Verified)',
          dateAdministered: new Date().toISOString().split('T')[0],
          dateExpires: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
          batch: 'RB-NEW-01',
          vet: 'Dr. Sarah Jenkins',
          type: 'rabies'
        }
      ],
      documents: [],
      completedChecklistIds: ['c1', 'c2']
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-pet-modal-title">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 id="add-pet-modal-title" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
            Add New Pet Passport Profile
          </h3>
          <button onClick={onClose} aria-label="Close modal" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Photo Uploader */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'var(--bg-surface-elevated)',
            padding: 12,
            borderRadius: 12,
            border: '1px solid var(--border-color)'
          }}>
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Pet Preview"
                style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', border: '2px solid var(--color-brand-primary)' }}
              />
            ) : (
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-brand-primary)'
              }}>
                <Camera size={24} />
              </div>
            )}

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 2 }}>
                Pet Passport Photo (Optional)
              </label>
              <label className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Camera size={12} /> Upload Custom Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Pet Name
              </label>
              <input
                type="text"
                placeholder="e.g. Bella"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Species
              </label>
              <select
                value={species}
                onChange={e => setSpecies(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                <option value="Dog">Dog 🐶</option>
                <option value="Cat">Cat 🐱</option>
                <option value="Ferret">Ferret 🦦</option>
                <option value="Bird">Bird 🦜</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Breed
              </label>
              <input
                type="text"
                placeholder="e.g. French Bulldog, Siamese, Poodle"
                value={breed}
                onChange={e => setBreed(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={e => setWeightKg(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
              15-Digit ISO 11784/11785 Microchip ID
            </label>
            <input
              type="text"
              placeholder="e.g. 985141009988221"
              value={microchipId}
              onChange={e => setMicrochipId(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 700 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Departure Country
              </label>
              <select
                value={originCountry}
                onChange={e => setOriginCountry(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                <option value="USA">United States (USA)</option>
                <option value="EU">European Union (EU)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="IND">India 🇮🇳</option>
                <option value="SGP">Singapore 🇸🇬</option>
                <option value="JPN">Japan 🇯🇵</option>
                <option value="AUS">Australia 🇦🇺</option>
                <option value="NZL">New Zealand 🇳🇿</option>
                <option value="FJI">Fiji 🇫🇯</option>
                <option value="THA">Thailand 🇹🇭</option>
                <option value="KOR">South Korea 🇰🇷</option>
                <option value="MYS">Malaysia 🇲🇾</option>
                <option value="HKG">Hong Kong 🇭🇰</option>
                <option value="CAN">Canada 🇨🇦</option>
                <option value="UAE">United Arab Emirates 🇦🇪</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                Destination Country
              </label>
              <select
                value={destinationCountry}
                onChange={e => setDestinationCountry(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                <option value="EU">European Union (EU)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="USA">United States (USA)</option>
                <option value="IND">India 🇮🇳</option>
                <option value="SGP">Singapore 🇸🇬</option>
                <option value="JPN">Japan 🇯🇵</option>
                <option value="AUS">Australia 🇦🇺</option>
                <option value="NZL">New Zealand 🇳🇿</option>
                <option value="FJI">Fiji 🇫🇯</option>
                <option value="THA">Thailand 🇹🇭</option>
                <option value="KOR">South Korea 🇰🇷</option>
                <option value="MYS">Malaysia 🇲🇾</option>
                <option value="HKG">Hong Kong 🇭🇰</option>
                <option value="UAE">United Arab Emirates 🇦🇪</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Pet Passport
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
