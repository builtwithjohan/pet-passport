import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGULATION_SOURCES = [
  {
    id: 'CDC_USA',
    name: 'US CDC Dog Import Rules',
    country: 'USA',
    url: 'https://www.cdc.gov/importation/bringing-an-animal-into-the-united-states/dogs/index.html',
    keyTerms: ['CDC Dog Import Form', 'Rabies', 'Microchip', 'CDC Care Facility']
  },
  {
    id: 'EU_PETS',
    name: 'EU Food Safety Pet Movement',
    country: 'EU',
    url: 'https://ec.europa.eu/food/animals/pet-movement_en',
    keyTerms: ['Annex IV', 'Rabies Titre', 'Microchip', 'Praziquantel']
  },
  {
    id: 'UK_DEFRA',
    name: 'UK GOV Pet Travel Rules',
    country: 'UK',
    url: 'https://www.gov.uk/bring-pet-to-great-britain',
    keyTerms: ['Great Britain Pet Health Certificate', 'Tapeworm', 'Rabies']
  },
  {
    id: 'INDIA_AQCS',
    name: 'India AQCS Animal Quarantine',
    country: 'India',
    url: 'https://aqcsindia.gov.in',
    keyTerms: ['NOC Permit', 'Rabies', 'Veterinary Certificate']
  },
  {
    id: 'SINGAPORE_AVS',
    name: 'Singapore AVS NParks',
    country: 'Singapore',
    url: 'https://www.nparks.gov.sg/avs/pets/bringing-animals-into-singapore-and-exporting',
    keyTerms: ['Category A', 'Category B', 'Category C', 'SAQS', 'FAVN']
  },
  {
    id: 'JAPAN_MAFF',
    name: 'Japan MAFF Animal Quarantine Service',
    country: 'Japan',
    url: 'https://www.maff.go.jp/aqs/english/animal/dog/index.html',
    keyTerms: ['180 days', 'FAVN', 'Form A', 'Form B', 'AQS']
  },
  {
    id: 'AUSTRALIA_DAFF',
    name: 'Australia DAFF Pet Import',
    country: 'Australia',
    url: 'https://www.agriculture.gov.au/biosecurity-trade/cats-dogs',
    keyTerms: ['PEQ Mickleham', 'FAVN', 'Import Permit', 'Ehrlichia']
  },
  {
    id: 'NZ_MPI',
    name: 'New Zealand MPI Biosecurity',
    country: 'New Zealand',
    url: 'https://www.mpi.govt.nz/import/border-clearance/pets/',
    keyTerms: ['PEQ', 'Import Permit', 'Rabies Titre', 'Biosecurity']
  }
];

async function checkPortals() {
  console.log('Checking regulation sources...');
  const auditResults = [];
  let totalOk = 0;
  let totalWarnings = 0;

  for (const source of REGULATION_SOURCES) {
    console.log(`Checking [${source.country}] ${source.name}...`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(source.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'PetPassport/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        const foundTerms = source.keyTerms.filter(term => text.toLowerCase().includes(term.toLowerCase()));

        auditResults.push({
          id: source.id,
          name: source.name,
          country: source.country,
          url: source.url,
          status: 'REACHABLE',
          statusCode: res.status,
          verifiedKeywordsCount: foundTerms.length,
          matchedKeywords: foundTerms,
          contentLengthBytes: text.length,
          lastChecked: new Date().toISOString()
        });
        totalOk++;
      } else {
        auditResults.push({
          id: source.id,
          name: source.name,
          country: source.country,
          url: source.url,
          status: 'HTTP_' + res.status,
          statusCode: res.status,
          verifiedKeywordsCount: 0,
          matchedKeywords: [],
          lastChecked: new Date().toISOString()
        });
        totalWarnings++;
      }
    } catch (err) {
      console.warn(`Warning checking ${source.name}: ${err.message}`);
      auditResults.push({
        id: source.id,
        name: source.name,
        country: source.country,
        url: source.url,
        status: 'UNREACHABLE',
        errorDetails: err.message,
        lastChecked: new Date().toISOString()
      });
      totalWarnings++;
    }
  }

  const auditReport = {
    auditTimestamp: new Date().toISOString(),
    auditSummary: {
      totalMonitored: REGULATION_SOURCES.length,
      portalsActive: totalOk,
      portalsFlagged: totalWarnings,
      status: totalWarnings === 0 ? 'PORTALS_REACHABLE' : 'ATTENTION_NEEDED'
    },
    results: auditResults
  };

  const outputPath = path.join(__dirname, '../src/data/lastRegulationAudit.json');
  fs.writeFileSync(outputPath, JSON.stringify(auditReport, null, 2));

  console.log(`Portal check completed. Reachable: ${totalOk} | Issues: ${totalWarnings}`);
}

checkPortals();
