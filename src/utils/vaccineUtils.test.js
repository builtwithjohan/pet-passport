import { describe, it, expect } from 'vitest';
import { getVaccineStatus, isRabiesValid, computeDestinationReadinessScore } from './vaccineUtils';

describe('vaccineUtils', () => {
  it('correctly calculates expired vaccine status', () => {
    const expiredVaccine = {
      name: 'Rabies',
      dateAdministered: '2020-01-01',
      dateExpires: '2021-01-01'
    };
    const result = getVaccineStatus(expiredVaccine);
    expect(result.status).toBe('expired');
    expect(result.isExpired).toBe(true);
  });

  it('correctly calculates warning vaccine status for upcoming expiration', () => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const warningVaccine = {
      name: 'Rabies',
      dateAdministered: '2023-01-01',
      dateExpires: futureDate
    };
    const result = getVaccineStatus(warningVaccine);
    expect(result.status).toBe('warning');
    expect(result.isWarning).toBe(true);
  });

  it('correctly validates rabies status on pet', () => {
    const petWithRabies = {
      vaccinations: [
        { name: 'Rabies 3-Year', dateAdministered: '2024-01-01', dateExpires: '2027-01-01' }
      ]
    };
    expect(isRabiesValid(petWithRabies)).toBe(true);
  });

  it('computes destination readiness score against country requirements', () => {
    const completePet = {
      microchipId: '985141009988776',
      originCountry: 'USA',
      destinationCountry: 'EU',
      vaccinations: [
        { name: 'Rabies 3-Year', dateAdministered: '2024-01-01', dateExpires: '2027-01-01' }
      ],
      documents: [{ id: 'd1', name: 'Health Cert' }],
      completedChecklistIds: ['c1', 'c2', 'c3']
    };

    const score = computeDestinationReadinessScore(completePet, 'EU');
    expect(score).toBeGreaterThanOrEqual(80);
  });
});
