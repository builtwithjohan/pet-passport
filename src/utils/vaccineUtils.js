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

  let totalPoints = 0;
  let maxPoints = 100;

  // 1. Microchip presence & date (25 points)
  if (pet.microchipId && pet.microchipId.length >= 10) {
    totalPoints += 25;
  }

  // 2. Valid Rabies Vaccination (35 points)
  if (isRabiesValid(pet)) {
    totalPoints += 35;
  }

  // 3. Completed checklist items (25 points)
  const completedCount = pet.completedChecklistIds?.length || 0;
  totalPoints += Math.min(25, completedCount * 5);

  // 4. Stored Documents (15 points)
  if (pet.documents && pet.documents.length > 0) {
    totalPoints += Math.min(15, pet.documents.length * 5);
  }

  return Math.min(100, Math.round(totalPoints));
}
