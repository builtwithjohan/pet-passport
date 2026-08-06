# Pet Passport

Cross-platform web and mobile app for tracking pet vaccination records, verifying country biosecurity entry requirements, calculating airline carrier dimensions, and organizing travel documentation.

## Features

- **Pet Passport & PDF Export**: Track microchip IDs (ISO 11784/11785), rabies records, and export printable PDF passports.
- **Biosecurity Rules Engine**: Entry requirements for EU, US (CDC), UK, India (AQCS), Singapore (AVS), Japan (MAFF), Australia (DAFF), New Zealand (MPI), and UAE.
- **Airline Carrier Calculator**: Validate in-cabin vs cargo container dimensions for Delta, United, American, Lufthansa, Air France, BA, and Emirates.
- **Travel Timeline**: Checklist for pre-departure requirements (T-120 days to flight day).
- **Multi-User Sync**: Offline-first local storage with family sharing code support.
- **Automated Workflows**: Weekly regulation checks and store deployment pipelines via GitHub Actions.

## Stack

- **Frontend**: React, Vite, jsPDF, Lucide Icons
- **Mobile**: Capacitor (iOS / Android)
- **Database**: PostgreSQL / Supabase schema with Row Level Security
- **CI/CD**: GitHub Actions

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

## Mobile (Capacitor)

```bash
# Sync web build to native iOS/Android projects
npx cap sync

# Open native project in Xcode or Android Studio
npx cap open ios
npx cap open android
```

## Scripts

```bash
# Run regulation checker script
npm run audit-regulations
```

## License

MIT
