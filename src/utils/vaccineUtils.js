import { COUNTRIES, RABIES_HIGH_RISK_COUNTRIES } from '../data/countriesData';

/**
 * Utility functions for computing vaccination status and compliance dynamically from dates.
 */

export function getVaccineStatus(vaccine) {
  if (!vaccine || !vaccine.dateExpires) {
    return { status: 'warning', label: 'Missing Expiry Date', isExpired: false, isWarning: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(vaccine.dateExpires);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'expired', label: `Expired ${Math.abs(diffDays)} days ago`, isExpired: true, isWarning: false, diffDays };
  } else if (diffDays <= 60) {
    return { status: 'warning', label: `Expires in ${diffDays} days`, isExpired: false, isWarning: true, diffDays };
  } else {
    return { status: 'valid', label: `Valid until ${vaccine.dateExpires}`, isExpired: false, isWarning: false, diffDays };
  }
}

export function isRabiesValid(pet) {
  if (!pet || !pet.vaccinations || pet.vaccinations.length === 0) return false;
  
  return pet.vaccinations.some(v => {
    const isRabies = (v.name || '').toLowerCase().includes('rabies') || (v.type === 'rabies');
    if (!isRabies) return false;
    const { isExpired } = getVaccineStatus(v);
    return !isExpired;
  });
}

export function computeDestinationReadinessScore(pet, destinationCountryCode = 'EU') {
  if (!pet) return 0;

  const targetCountry = COUNTRIES.find(c => c.code === destinationCountryCode || c.id === destinationCountryCode) || COUNTRIES[0];
  const isFromHighRisk = RABIES_HIGH_RISK_COUNTRIES.includes(pet.originCountry);

  let earned = 0;
  let totalWeight = 0;

  // 1. Microchip Requirement (Weight: 25)
  totalWeight += 25;
  if (targetCountry.microchip.required) {
    if (pet.microchipId && pet.microchipId.length >= 10) {
      earned += 25;
    }
  } else {
    earned += 25;
  }

  // 2. Rabies Vaccine Requirement (Weight: 35)
  totalWeight += 35;
  if (targetCountry.rabies.required) {
    if (isRabiesValid(pet)) {
      earned += 35;
    }
  } else {
    earned += 35;
  }

  // 3. Titre Test Requirement (Weight: 20)
  const needsTitre = (isFromHighRisk && targetCountry.titreTest?.requiredForHighRisk) || targetCountry.titreTest?.requiredForLowRisk;
  totalWeight += 20;
  if (needsTitre) {
    const hasTitre = pet.vaccinations?.some(v => {
      const isTitre = (v.name || '').toLowerCase().includes('titre') || (v.name || '').toLowerCase().includes('favn') || v.type === 'titre';
      return isTitre && getVaccineStatus(v).status !== 'expired';
    });
    if (hasTitre) earned += 20;
  } else {
    earned += 20;
  }

  // 4. Documents Vault (Weight: 20)
  totalWeight += 20;
  if (pet.documents && pet.documents.length > 0) {
    earned += Math.min(20, pet.documents.length * 10);
  }

  return Math.min(100, Math.round((earned / totalWeight) * 100));
}
