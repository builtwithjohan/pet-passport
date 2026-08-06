-- ============================================================================
-- PET PASSPORT — PRODUCTION MULTI-TENANT DATABASE SCHEMA (PostgreSQL / Supabase)
-- Provides multi-user auth, family sharing permissions, & scalable pet storage
-- ============================================================================

-- 1. Users Profile Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  account_type TEXT DEFAULT 'FREE_TRAVELER', -- 'FREE_TRAVELER', 'PREMIUM_TRAVELER', 'VET_PARTNER'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pets Table
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT 'Dog',
  breed TEXT NOT NULL,
  sex TEXT NOT NULL,
  dob DATE,
  weight_kg NUMERIC(5,2),
  microchip_id TEXT NOT NULL,
  microchip_date DATE,
  color TEXT,
  origin_country TEXT NOT NULL DEFAULT 'USA',
  destination_country TEXT NOT NULL DEFAULT 'EU',
  photo_url TEXT,
  passport_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pet Family / Vet Co-Ownership & Sharing Table
CREATE TABLE IF NOT EXISTS public.pet_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  shared_with_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission_role TEXT NOT NULL DEFAULT 'READ_WRITE', -- 'READ_ONLY', 'READ_WRITE', 'CO_OWNER'
  share_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vaccinations & Titre Blood Tests Table
CREATE TABLE IF NOT EXISTS public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_administered DATE NOT NULL,
  date_expires DATE NOT NULL,
  batch_number TEXT,
  administering_vet_name TEXT,
  status TEXT DEFAULT 'valid', -- 'valid', 'warning', 'expired'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Documents Vault Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_kb INTEGER,
  status TEXT DEFAULT 'Verified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Checklist Progress Table
CREATE TABLE IF NOT EXISTS public.checklist_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  completed_checklist_item_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pet_id, completed_checklist_item_id)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — Ensures total data isolation per user
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view & update their own profile
CREATE POLICY "Profiles self access" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Policy: Owners or Shared Family members can view & edit pets
CREATE POLICY "Pet owner or shared access" ON public.pets
  FOR ALL USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.pet_shares
      WHERE pet_shares.pet_id = pets.id
      AND pet_shares.shared_with_user_id = auth.uid()
    )
  );

-- Policy: Vaccinations access linked to pet access
CREATE POLICY "Vaccinations pet access" ON public.vaccinations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pets
      WHERE pets.id = vaccinations.pet_id
      AND (pets.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.pet_shares WHERE pet_shares.pet_id = pets.id AND pet_shares.shared_with_user_id = auth.uid()
      ))
    )
  );

-- Indexing for High Scale Performance
CREATE INDEX IF NOT EXISTS idx_pets_owner ON public.pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_pet ON public.vaccinations(pet_id);
CREATE INDEX IF NOT EXISTS idx_documents_pet ON public.documents(pet_id);
