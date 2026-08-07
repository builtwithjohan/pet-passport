import React, { useState, useEffect } from 'react';
import { X, Camera, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { dbStore } from '../services/dbStore';

export default function EditPetModal({ pet, onClose, onUpdatePet }) {
  const [name, setName] = useState(pet.name || '');
  const [species, setSpecies] = useState(pet.species || 'Dog');
  const [breed, setBreed] = useState(pet.breed || '');
  const [sex, setSex] = useState(pet.sex || 'Male (Neutered)');
  const [weightKg, setWeightKg] = useState(pet.weightKg ? String(pet.weightKg) : '8.5');
  const [dob, setDob] = useState(pet.dob || '2022-06-01');
  const [microchipId, setMicrochipId] = useState(pet.microchipId || '');
  const [microchipDate, setMicrochipDate] = useState(pet.microchipDate || new Date().toISOString().split('T')[0]);
  const [color, setColor] = useState(pet.color || '');
  const [originCountry, setOriginCountry] = useState(pet.originCountry || 'USA');
  const [destinationCountry, setDestinationCountry] = useState(pet.destinationCountry || 'EU');
  const [passportNumber, setPassportNumber] = useState(pet.passportNumber || '');

  // Vet details
  const [vetName, setVetName] = useState(pet.veterinarian?.name || 'Dr. Sarah Jenkins, DVM');
  const [vetClinic, setVetClinic] = useState(pet.veterinarian?.clinic || 'Metropolitan Pet Hospital');
  const [vetPhone, setVetPhone] = useState(pet.veterinarian?.phone || '+1 (555) 234-5678');
  const [vetLicense, setVetLicense] = useState(pet.veterinarian?.license || 'VET-8891');

  // Photo uploading state
  const [photoPreview, setPhotoPreview] = useState(pet.photoUrl || '');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  useEffect(() => {
    // Load custom photo blob from IndexedDB if available
    async function loadPhotoBlob() {
      try {
        const blob = await dbStore.getPetPhotoBlob(pet.id);
        if (blob) {
          const objectUrl = URL.createObjectURL(blob);
          setPhotoPreview(objectUrl);
        }
      } catch (err) {
        console.warn('Failed to load pet photo blob from IndexedDB:', err);
      }
    }
    loadPhotoBlob();
  }, [pet.id]);

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

    // Save photo file to IndexedDB if newly selected
    let finalPhotoUrl = photoPreview;
    if (selectedPhotoFile) {
      try {
        await dbStore.savePetPhotoBlob(pet.id, selectedPhotoFile);
      } catch (err) {
        console.warn('Failed to save pet photo blob:', err);
      }
    }

    const updatedPet = {
      ...pet,
      name,
      species,
      breed,
      sex,
      weightKg: parseFloat(weightKg) || 5,
      dob,
      microchipId,
      microchipDate,
      color,
      originCountry,
      destinationCountry,
      passportNumber: passportNumber || pet.passportNumber,
      photoUrl: finalPhotoUrl,
      veterinarian: {
        name: vetName,
        clinic: vetClinic,
        phone: vetPhone,
        license: vetLicense
      }
    };

    onUpdatePet(updatedPet);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="edit-pet-modal-title">
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 id="edit-pet-modal-title" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: 0 }}>
            Edit Pet Profile & Passport Info
          </h3>
          <button onClick={onClose} aria-label="Close modal" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Photo Uploader */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: 'var(--bg-surface-elevated)',
            padding: 14,
            borderRadius: 14,
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ position: 'relative', width: 72, height: 72, borderRadius: 16, overflow: 'hidden', border: '2px solid var(--color-brand-primary)' }}>
              <img
                src={photoPreview || pet.photoUrl}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                Pet Profile Picture
              </label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>
                Upload photo stored safely in your IndexedDB database
              </p>
              <label className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Camera size={14} /> Choose New Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Name & Species */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Pet Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Species</label>
              <select
                className="form-select"
                value={species}
                onChange={e => setSpecies(e.target.value)}
              >
                <option value="Dog">Dog 🐶</option>
                <option value="Cat">Cat 🐱</option>
                <option value="Ferret">Ferret 🦦</option>
                <option value="Bird">Bird 🦜</option>
              </select>
            </div>
          </div>

          {/* Breed, Weight, Sex */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Breed</label>
              <input
                type="text"
                className="form-input"
                value={breed}
                onChange={e => setBreed(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={weightKg}
                onChange={e => setWeightKg(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Sex</label>
              <select
                className="form-select"
                value={sex}
                onChange={e => setSex(e.target.value)}
              >
                <option value="Male (Neutered)">Male (Neutered)</option>
                <option value="Female (Spayed)">Female (Spayed)</option>
                <option value="Male (Intact)">Male (Intact)</option>
                <option value="Female (Intact)">Female (Intact)</option>
              </select>
            </div>
          </div>

          {/* Microchip & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">15-Digit Microchip ID</label>
              <input
                type="text"
                className="form-input"
                style={{ fontFamily: 'monospace', fontWeight: 700 }}
                value={microchipId}
                onChange={e => setMicrochipId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Microchip Date</label>
              <input
                type="date"
                className="form-input"
                value={microchipDate}
                onChange={e => setMicrochipDate(e.target.value)}
              />
            </div>
          </div>

          {/* Departure & Destination */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Departure Country</label>
              <select
                className="form-select"
                value={originCountry}
                onChange={e => setOriginCountry(e.target.value)}
              >
                <option value="USA">United States (USA)</option>
                <option value="EU">European Union (EU)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="IND">India 🇮🇳</option>
                <option value="SGP">Singapore 🇸🇬</option>
                <option value="JPN">Japan 🇯🇵</option>
                <option value="AUS">Australia 🇦🇺</option>
                <option value="NZL">New Zealand 🇳🇿</option>
                <option value="THA">Thailand 🇹🇭</option>
                <option value="KOR">South Korea 🇰🇷</option>
                <option value="CAN">Canada 🇨🇦</option>
                <option value="UAE">UAE 🇦🇪</option>
              </select>
            </div>
            <div>
              <label className="form-label">Destination Country</label>
              <select
                className="form-select"
                value={destinationCountry}
                onChange={e => setDestinationCountry(e.target.value)}
              >
                <option value="EU">European Union (EU)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="USA">United States (USA)</option>
                <option value="IND">India 🇮🇳</option>
                <option value="SGP">Singapore 🇸🇬</option>
                <option value="JPN">Japan 🇯🇵</option>
                <option value="AUS">Australia 🇦🇺</option>
                <option value="NZL">New Zealand 🇳🇿</option>
                <option value="THA">Thailand 🇹🇭</option>
                <option value="KOR">South Korea 🇰🇷</option>
                <option value="UAE">UAE 🇦🇪</option>
              </select>
            </div>
          </div>

          {/* Veterinarian info */}
          <div style={{ background: 'var(--bg-surface-elevated)', padding: 12, borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-brand-accent)', display: 'block', marginBottom: 8 }}>
              Veterinarian Info
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Vet Name</label>
                <input type="text" className="form-input" value={vetName} onChange={e => setVetName(e.target.value)} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Clinic Name</label>
                <input type="text" className="form-input" value={vetClinic} onChange={e => setVetClinic(e.target.value)} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone</label>
                <input type="text" className="form-input" value={vetPhone} onChange={e => setVetPhone(e.target.value)} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>License No</label>
                <input type="text" className="form-input" value={vetLicense} onChange={e => setVetLicense(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Pet Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
