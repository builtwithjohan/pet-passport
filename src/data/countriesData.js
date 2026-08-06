export const COUNTRIES = [
  {
    id: 'EU',
    name: 'European Union (EU / Schengen Area)',
    flag: '🇪🇺',
    code: 'EU',
    riskCategory: 'Standard Low-Risk',
    summary: 'Strict rabies vaccination & ISO microchip requirements. Tapeworm treatment needed for select countries.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785 (15-digit FDX-B)',
      notes: 'Must be implanted BEFORE or on the same day as the primary Rabies vaccine.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 21,
      notes: 'Primary rabies vaccine requires a 21-day wait before travel. Revaccination without lapse requires no wait.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: false,
      details: 'Required if traveling from a rabies high-risk country. Must be drawn 30+ days after vaccination and tested by an EU-approved lab (>= 0.5 IU/ml). Wait 3 months after blood draw before entry.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['UK', 'Ireland', 'Finland', 'Norway', 'Malta'],
      timing: '24 to 120 hours (1 to 5 days) before arrival',
      ingredient: 'Praziquantel or equivalent'
    },
    healthCert: {
      name: 'EU Annex IV Health Certificate',
      validity: '10 days from vet signature & USDA/Official endorsement until port of entry check.'
    },
    quarantine: '0 days if all requirements met.',
    prohibitedBreeds: ['Pit Bull Terrier', 'Staffordshire Bull Terrier (some EU states)', 'Japanese Tosa (France/Germany restriction)', 'Fila Brasileiro', 'Dogo Argentino'],
    officialPortal: 'https://ec.europa.eu/food/animals/pet-movement_en'
  },
  {
    id: 'USA',
    name: 'United States of America',
    flag: '🇺🇸',
    code: 'USA',
    riskCategory: 'CDC Dog Import Rule Updated 2024',
    summary: 'New CDC regulations apply to all dogs entering USA. Microchip + CDC Dog Import Form mandatory.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785 compatible',
      notes: 'Must be scanned before rabies vaccine administration.'
    },
    rabies: {
      required: true,
      minAge: '6 months for dogs under new CDC rules',
      waitingPeriodDays: 28,
      notes: 'Dogs from high-risk rabies countries need CDC Rabies Vaccination & Microchip Form or valid US-issued certificate.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: false,
      details: 'Required if coming from high-risk rabies country with foreign rabies vaccine to bypass extended quarantine.'
    },
    tapewormTreatment: {
      required: false,
      applicableCountries: [],
      timing: 'N/A',
      ingredient: 'N/A'
    },
    healthCert: {
      name: 'CDC Dog Import Form + USDA Health Certificate',
      validity: 'CDC Form is valid for 2 to 6 months depending on rabies status. Vet Cert within 10 days of travel.'
    },
    quarantine: '0 days if CDC protocol fulfilled. Up to 28 days at CDC care facility if non-compliant.',
    prohibitedBreeds: ['No federal breed bans, but specific airlines or states may have restrictions.'],
    officialPortal: 'https://www.cdc.gov/importation/bringing-an-animal-into-the-united-states/dogs.html'
  },
  {
    id: 'UK',
    name: 'United Kingdom (England, Scotland, Wales)',
    flag: '🇬🇧',
    code: 'UK',
    riskCategory: 'High Biosecurity Strict',
    summary: 'Requires ISO microchip, rabies vaccine, tapeworm treatment, and approval via Great Britain Pet Health Certificate.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785',
      notes: 'Microchip number must be stated on all certificates.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 21,
      notes: '21 days after primary vaccination. Must be given after microchipping.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: false,
      details: 'If arriving from unlisted/high-risk country, FAVN rabies titre test needed 30 days post-vaccine + 3 calendar month wait.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All countries except ROI, Finland, Norway, Malta'],
      timing: '24 to 120 hours before arrival in UK',
      ingredient: 'Praziquantel administered by a registered veterinarian'
    },
    healthCert: {
      name: 'GB Pet Health Certificate / UK Pet Passport',
      validity: '10 days from official vet endorsement until arrival.'
    },
    quarantine: '0 days if rules followed. Up to 4 months if non-compliant.',
    prohibitedBreeds: ['Pit Bull Terrier', 'Japanese Tosa', 'Dogo Argentino', 'Fila Brasileiro', 'XL Bully (restricted)'],
    officialPortal: 'https://www.gov.uk/bring-pet-to-great-britain'
  },
  {
    id: 'IND',
    name: 'India',
    flag: '🇮🇳',
    code: 'IND',
    riskCategory: 'AQCS Advance Import NOC Permit Required',
    summary: 'Requires Advance NOC from AQCS (Delhi, Mumbai, Chennai, Kolkata, Bengaluru), Rabies vaccine 30+ days prior, and ISO microchip.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785 (15-digit)',
      notes: 'Microchip required prior to rabies vaccination.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 30,
      notes: 'Rabies vaccination administered at least 30 days prior to departure (valid up to 1 year for 1-year vaccine, 3 years for 3-year vaccine).'
    },
    titreTest: {
      requiredForHighRisk: false,
      requiredForLowRisk: false,
      details: 'Not strictly required for entry into India, but strongly recommended if returning to EU/US/UK later.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets entering India'],
      timing: 'Within 7 days of departure',
      ingredient: 'Internal & external parasite treatment (Praziquantel & Fipronil)'
    },
    healthCert: {
      name: 'AQCS No Objection Certificate (NOC) + Government Vet Health Certificate',
      validity: 'AQCS NOC valid for specific flight dates. Health cert signed within 7 days of departure.'
    },
    quarantine: '0 days home quarantine if AQCS NOC and official health cert are approved prior to boarding.',
    prohibitedBreeds: ['Pitbull Terrier', 'Tosa Inu', 'American Staffordshire Terrier', 'Fila Brasileiro', 'Dogo Argentino', 'American Bulldog', 'Boerboel', 'Rottweiler', 'Wolfdog'],
    officialPortal: 'https://aqcsindia.gov.in'
  },
  {
    id: 'SGP',
    name: 'Singapore',
    flag: '🇸🇬',
    code: 'SGP',
    riskCategory: 'AVS Category A/B/C/D Biosecurity System',
    summary: 'Strict AVS / NParks import license, dog license, FAVN rabies titre test, and potential quarantine at SAQS based on origin category.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785 (15-digit)',
      notes: 'Must be readable with a standard ISO scanner.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 30,
      notes: 'Primary rabies vaccination must be given after microchip implantation.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: false,
      details: 'FAVN Rabies Titre Test (>= 0.5 IU/ml) required for Category C and D countries (drawn 30+ days post-vaccine).'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets entering Singapore'],
      timing: '2 to 7 days before export',
      ingredient: 'Praziquantel for tapeworm and Fipronil/Permethrin for fleas & ticks'
    },
    healthCert: {
      name: 'AVS Import License + Veterinary Health Certificate AVS Form',
      validity: 'AVS import permit valid for 30 days. Vet cert signed within 7 days of export.'
    },
    quarantine: '0 days for Cat A/B (e.g. UK, Australia, NZ). 10 to 30 days at Sembawang Animal Quarantine Station (SAQS) for Cat C/D.',
    prohibitedBreeds: ['Pit Bull (American Pit Bull Terrier, Staffordshire Bull Terrier, American Staffordshire), American Bully, Dogo Argentino, Fila Brasileiro, Japanese Tosa, Perro de Presa Canario, Neapolitan Mastiff'],
    officialPortal: 'https://www.nparks.gov.sg/avs/pets/bringing-animals-into-singapore-and-exporting/bringing-dogs-and-cats-into-singapore'
  },
  {
    id: 'THA',
    name: 'Thailand (Bangkok, Phuket)',
    flag: '🇹🇭',
    code: 'THA',
    riskCategory: 'DLD Import Permit Required',
    summary: 'Requires Department of Livestock Development (DLD) import permit, Rabies & Leptospirosis vaccines, and ISO microchip.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785',
      notes: 'Microchip mandatory for import approval.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 21,
      notes: 'Rabies vaccine given at least 21 days before travel.'
    },
    titreTest: {
      requiredForHighRisk: false,
      requiredForLowRisk: false,
      details: 'Not mandatory for entry into Thailand, but recommended if transiting rabies-free zones.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets'],
      timing: 'Within 7 days of departure',
      ingredient: 'Broad spectrum parasite treatment'
    },
    healthCert: {
      name: 'DLD Form R1-1 Import Permit + Official Veterinary Health Cert',
      validity: 'Import permit applied at Suvarnabhumi Airport Animal Quarantine Station 7-10 days in advance.'
    },
    quarantine: '0 days if pre-approved at Bangkok (BKK) or Phuket (HKT) quarantine station.',
    prohibitedBreeds: ['Pit Bull Terrier', 'American Staffordshire Terrier'],
    officialPortal: 'https://dld.go.th/en/'
  },
  {
    id: 'KOR',
    name: 'South Korea (Seoul Incheon)',
    flag: '🇰🇷',
    code: 'KOR',
    riskCategory: 'APQA FAVN Titre Standard',
    summary: 'Requires ISO microchip, Rabies vaccine, and FAVN Rabies antibody titre test (>= 0.5 IU/ml) for 0-day quarantine.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785',
      notes: 'Microchip scanned upon arrival at Incheon Airport APQA.'
    },
    rabies: {
      required: true,
      minAge: '90 days',
      waitingPeriodDays: 30,
      notes: 'Rabies vaccine given 30+ days prior to travel.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: true,
      details: 'FAVN Rabies Titre Test (>= 0.5 IU/ml) drawn within 24 months prior to flight. Mandatory for 0-day quarantine release.'
    },
    tapewormTreatment: {
      required: false,
      applicableCountries: [],
      timing: 'N/A',
      ingredient: 'N/A'
    },
    healthCert: {
      name: 'APQA Veterinary Health Certificate (Government Endorsed)',
      validity: 'Signed within 10 days of departure.'
    },
    quarantine: '0 days if microchip matches and FAVN titre test result is >= 0.5 IU/ml. Otherwise quarantined until test completed.',
    prohibitedBreeds: ['Tosa Inu', 'American Pit Bull Terrier', 'American Staffordshire Terrier', 'Staffordshire Bull Terrier', 'Rottweiler'],
    officialPortal: 'https://www.qia.go.kr/english/html/indexqiaEnglish.jsp'
  },
  {
    id: 'MYS',
    name: 'Malaysia (Kuala Lumpur)',
    flag: '🇲🇾',
    code: 'MYS',
    riskCategory: 'DVS Import Permit & KLIA Quarantine',
    summary: 'Requires DVS import permit, Rabies vaccine, FAVN test, and 7-day quarantine at KLIA Animal Quarantine Station for unlisted origins.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785',
      notes: 'Implanted before rabies vaccination.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 30,
      notes: 'Rabies vaccine administered at least 30 days before flight.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: false,
      details: 'FAVN test needed for pets from rabies-endemic countries.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets entering Malaysia'],
      timing: 'Within 7 days of departure',
      ingredient: 'Praziquantel and external tick/flea treatment'
    },
    healthCert: {
      name: 'Department of Veterinary Services (DVS) Import Permit + Official Health Cert',
      validity: 'Import permit valid for 30 days.'
    },
    quarantine: '0 days for scheduled rabies-free countries (UK, Australia, NZ, Singapore, Japan). 7 to 30 days for other countries at KLIA Quarantine.',
    prohibitedBreeds: ['Pit Bull Terrier / American Pit Bull', 'American Staffordshire Terrier', 'Staffordshire Bull Terrier', 'Neapolitan Mastiff', 'Japanese Tosa', 'Akita', 'Dogo Argentino', 'Fila Brasileiro'],
    officialPortal: 'https://www.dvs.gov.my'
  },
  {
    id: 'NZL',
    name: 'New Zealand (Oceania)',
    flag: '🇳🇿',
    code: 'NZL',
    riskCategory: 'MPI Ultra-Strict Biosecurity',
    summary: 'Requires MPI Import Permit, FAVN rabies titre test, extensive blood testing (Ehrlichia/Leishmania/Heartworm), and mandatory 10-day PEQ quarantine.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785 (15-digit)',
      notes: 'Verified twice by government accredited vet.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 180,
      notes: 'Rabies vaccine + FAVN titre test drawn 3 to 24 months before travel.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: true,
      details: 'FAVN Rabies antibody test (>= 0.5 IU/ml) drawn between 3 and 24 months before export. Blood samples for Ehrlichia canis, Leishmania, Brucella, and Babesia required.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets entering New Zealand'],
      timing: 'Two separate treatments: 8 to 16 days before export, and within 4 days of export',
      ingredient: 'Praziquantel for tapeworm & Afoxolaner/Fluralaner for ticks'
    },
    healthCert: {
      name: 'MPI Import Permit + Model Veterinary Health Certificate B',
      validity: 'Import permit applied 2-3 months prior. Space booked at approved PEQ facility (Auckland or Christchurch).'
    },
    quarantine: 'Mandatory 10 days at an approved Post-Entry Quarantine (PEQ) facility in Auckland or Christchurch.',
    prohibitedBreeds: ['American Pit Bull Terrier', 'Brazilian Fila', 'Dogo Argentino', 'Japanese Tosa', 'Perro de Presa Canario'],
    officialPortal: 'https://www.mpi.govt.nz/import/border-clearance/pets/'
  },
  {
    id: 'FJI',
    name: 'Fiji (Oceania)',
    flag: '🇫🇯',
    code: 'FJI',
    riskCategory: 'BAF Rabies-Free Island Biosecurity',
    summary: 'Requires Biosecurity Authority of Fiji (BAF) import permit, strict rabies-free verification, and parasite treatments.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785',
      notes: 'Microchip ID recorded on BAF permit.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 30,
      notes: 'Pets from approved rabies-free countries (Australia, NZ) exempt from rabies vaccine if resident for 6+ months.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: false,
      details: 'FAVN test required if originating from rabies-endemic countries.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets entering Fiji'],
      timing: 'Within 4 days of flight',
      ingredient: 'Praziquantel and tick prevention'
    },
    healthCert: {
      name: 'BAF Import Permit + Official Export Veterinary Certificate',
      validity: 'BAF permit valid for 30 days.'
    },
    quarantine: '0 days if coming directly from Australia or New Zealand with BAF permit. 30 days for other countries.',
    prohibitedBreeds: ['Dogo Argentino', 'Fila Brasileiro', 'Japanese Tosa', 'Pit Bull Terrier'],
    officialPortal: 'https://baf.com.fj'
  },
  {
    id: 'HKG',
    name: 'Hong Kong SAR',
    flag: '🇭🇰',
    code: 'HKG',
    riskCategory: 'AFCD Group 1 / 2 / 3 Permit System',
    summary: 'Requires AFCD Import Permit. Group 1 (UK, AUS, NZ) = 0-day quarantine. Group 2 (USA, EU, JPN) = 0-day if compliant. Group 3 = 4-month quarantine.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785 or AVID 9-digit',
      notes: 'Hong Kong AFCD accepts ISO or AVID microchips.'
    },
    rabies: {
      required: true,
      minAge: '90 days',
      waitingPeriodDays: 30,
      notes: 'Vaccinated against rabies at least 30 days prior to travel.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: false,
      details: 'FAVN Titre Test required for Group 3 countries.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets'],
      timing: 'Within 10 days of export',
      ingredient: 'Full parasite treatment'
    },
    healthCert: {
      name: 'AFCD Special Permit (Form No. VC102) + Vet Cert Form VC-DC1',
      validity: 'AFCD Special Permit valid for 6 months.'
    },
    quarantine: '0 days for Group 1 and Group 2 countries if all requirements met. 4 months quarantine for Group 3 countries.',
    prohibitedBreeds: ['Pit Bull Terrier', 'Japanese Tosa', 'Dogo Argentino', 'Fila Brasileiro'],
    officialPortal: 'https://www.afcd.gov.hk/english/quarantine/qua_ie/qua_ie_ipab/qua_ie_ipab_idc/qua_ie_ipab_idc.html'
  },
  {
    id: 'JPN',
    name: 'Japan',
    flag: '🇯🇵',
    code: 'JPN',
    riskCategory: 'Rabies-Free Strict Biosecurity',
    summary: 'Requires 2 rabies shots, blood titre test >= 0.5 IU, and 180-day waiting period for 0-day quarantine.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785 (15-digit)',
      notes: 'Must be implanted BEFORE first rabies vaccine.'
    },
    rabies: {
      required: true,
      minAge: '91 days',
      waitingPeriodDays: 180,
      notes: 'Must receive AT LEAST TWO inactivated or recombinant rabies vaccines after microchip.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: true,
      details: 'FAVN Blood Titre Test mandatory for all non-designated countries. Blood drawn after 2nd rabies shot. Must wait 180 days from blood draw date before arriving in Japan.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All dogs and cats'],
      timing: 'Within 48 hours before export inspection',
      ingredient: 'Internal parasites (Praziquantel) & External parasites (Fipronil/Permethrin)'
    },
    healthCert: {
      name: 'Form A & Form B Japan MAFF Health Certificate',
      validity: 'Advance Notification submitted to Animal Quarantine Service (AQS) at least 40 days prior to arrival.'
    },
    quarantine: '0 to 12 hours if 180-day wait met. Up to 180 days in AQS facility if wait period incomplete.',
    prohibitedBreeds: ['No national breed ban, but airlines impose brachycephalic summer travel bans.'],
    officialPortal: 'https://www.maff.go.jp/aqs/english/animal/dog/index.html'
  },
  {
    id: 'AUS',
    name: 'Australia (Oceania)',
    flag: '🇦🇺',
    code: 'AUS',
    riskCategory: 'Ultra-Strict Biosecurity',
    summary: 'Very strict import permit required, FAVN test, parasite treatments, and mandatory 10-30 day quarantine at PEQ Mickleham.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785',
      notes: 'Microchip identity verification by government vet required.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 180,
      notes: 'Must undergo FAVN rabies neutralization antibody titre test.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: true,
      details: 'FAVN blood test mandatory. Must achieve >= 0.5 IU/ml. Preparations take 6-7 months total.'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets'],
      timing: 'Two separate treatments before departure (Internal + External parasites + Ehrlichia canis testing)',
      ingredient: 'Praziquantel and Afoxolaner/Fluralaner/Permethrin'
    },
    healthCert: {
      name: 'Department of Agriculture, Fisheries and Forestry (DAFF) Import Permit & Vet Cert',
      validity: 'Import permit applied 3+ months in advance.'
    },
    quarantine: 'Mandatory 10 to 30 days at Post-Entry Quarantine (PEQ) facility in Mickleham, Melbourne.',
    prohibitedBreeds: ['Dogo Argentino', 'Fila Brasileiro', 'Japanese Tosa', 'American Pit Bull Terrier', 'Perro de Presa Canario'],
    officialPortal: 'https://www.agriculture.gov.au/biosecurity-trade/cats-dogs'
  },
  {
    id: 'UAE',
    name: 'United Arab Emirates (Dubai, Abu Dhabi)',
    flag: '🇦🇪',
    code: 'UAE',
    riskCategory: 'MOCCAE Import Permit Required',
    summary: 'Requires MOCCAE import permit, Rabies Titre test, parasite treatment, and approved vet health certificate.',
    microchip: {
      required: true,
      standard: 'ISO 11784 / 11785',
      notes: 'Must be microchipped before rabies vaccine.'
    },
    rabies: {
      required: true,
      minAge: '12 weeks',
      waitingPeriodDays: 21,
      notes: 'Vaccine valid between 21 days and 1 year maximum.'
    },
    titreTest: {
      requiredForHighRisk: true,
      requiredForLowRisk: false,
      details: 'FAVN Rabies Titre test mandatory for pets coming from high-risk countries (draw at least 21 days post-vaccine).'
    },
    tapewormTreatment: {
      required: true,
      applicableCountries: ['All pets entering UAE'],
      timing: 'Within 14 days of departure',
      ingredient: 'Praziquantel and Broad spectrum internal/external parasite treatment'
    },
    healthCert: {
      name: 'MOCCAE Import Permit + USDA / Official Vet Health Cert',
      validity: 'MOCCAE permit valid for 30 days. Vet cert signed within 10 days of flight.'
    },
    quarantine: '0 days if all documentation is compliant.',
    prohibitedBreeds: ['Pit Bulls', 'Staffordshire Bull Terrier', 'American Bully', 'Rottweiler', 'Doberman Pinscher', 'Japanese Tosa', 'Presa Canario'],
    officialPortal: 'https://www.moccae.gov.ae'
  },
  {
    id: 'CAN',
    name: 'Canada',
    flag: '🇨🇦',
    code: 'CAN',
    riskCategory: 'Standard Low-Risk',
    summary: 'Rabies certificate or veterinary health certificate required. No mandatory microchip for personal pets, but recommended.',
    microchip: {
      required: false,
      standard: 'ISO 11784 / 11785 recommended',
      notes: 'Strongly recommended for travel ID, though Canadian Food Inspection Agency (CFIA) does not strictly require microchip for personal dogs >8 months.'
    },
    rabies: {
      required: true,
      minAge: '3 months',
      waitingPeriodDays: 0,
      notes: 'Rabies certificate signed by licensed vet stating breed, color, weight, vaccine trade name and lot number.'
    },
    titreTest: {
      requiredForHighRisk: false,
      requiredForLowRisk: false,
      details: 'Not required for entry into Canada.'
    },
    tapewormTreatment: {
      required: false,
      applicableCountries: [],
      timing: 'N/A',
      ingredient: 'N/A'
    },
    healthCert: {
      name: 'CFIA Veterinary Health Certificate / Official Rabies Cert',
      validity: 'Valid within vaccine expiry dates.'
    },
    quarantine: '0 days if compliant.',
    prohibitedBreeds: ['Pit Bull restrictions in Ontario and specific municipalities (e.g. Winnipeg).'],
    officialPortal: 'https://inspection.canada.ca/importing-food-plants-or-animals/pets/eng/1326600177363/1326600263442'
  }
];

export const RABIES_HIGH_RISK_COUNTRIES = [
  'Afghanistan', 'Algeria', 'Angola', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Belarus', 'Belize',
  'Bolivia', 'Brazil', 'Cambodia', 'China', 'Colombia', 'Cuba', 'Dominican Republic', 'Ecuador',
  'Egypt', 'El Salvador', 'Georgia', 'Guatemala', 'Haiti', 'Honduras', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Jordan', 'Kazakhstan', 'Kenya', 'Lebanon', 'Malaysia', 'Mexico', 'Morocco',
  'Nepal', 'Nigeria', 'Pakistan', 'Peru', 'Philippines', 'Russia', 'Saudi Arabia', 'South Africa',
  'Sri Lanka', 'Thailand', 'Turkey', 'Ukraine', 'Uzbekistan', 'Venezuela', 'Vietnam'
];
