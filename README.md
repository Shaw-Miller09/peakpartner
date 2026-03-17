# PeakPartner

PeakPartner is an Expo + React Native mobile app scaffold for connecting skiers and snowboarders who want to meet up, chat, share video clips, and track their sessions on the mountain.

## Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Supabase

## Project structure

```text
app/
  (auth)/              Authentication routes
  (onboarding)/        First-run onboarding flow
  (tabs)/              Main application tabs
  meetups/             Meetup-specific stack routes
components/
  auth/                Auth provider and auth form
  common/              Shared screen and placeholder components
  meetups/             Meetup UI and local domain provider
  onboarding/          Onboarding-specific UI helpers
hooks/                 App hooks
lib/                   External clients and app services
models/                Frontend domain models
services/              Mock seed data and domain logic
supabase/
  schema.sql           Database schema and starter RLS policies
```

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Add your Supabase project values:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Start Expo:

```bash
npm run start
```

5. Run on a simulator or device from the Expo CLI, or use:

```bash
npm run ios
npm run android
```

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in [supabase/schema.sql](/Users/shawmiller/Developer/projects/peakpartner/supabase/schema.sql) in the Supabase SQL editor.
3. Enable Email auth in Supabase Authentication.
4. Replace the environment variables with your project URL and anon key.

## Meetup system status

Fully implemented in-app:

- Meetup discovery screen with cards, filters, and empty states
- Create meetup flow with meetup type, group size, notes, and computed age-pool logic
- Meetup detail screen with participant list and action states
- Join logic for `public_open`, `public_approval`, and `private`
- Host approval management for pending join requests
- Public age-safety gating in discovery and join eligibility
- Connection-aware private meetup visibility and access

Implemented as mocked local domain state for this pass:

- Meetup data persistence
- Profile, connection, participant, and join-request records
- Current meetup actions and updates

Supabase-ready but not fully wired yet:

- `lib/supabase.ts` remains the backend entry point
- [supabase/schema.sql](/Users/shawmiller/Developer/projects/peakpartner/supabase/schema.sql) now includes the extra meetup and age-group fields used by the UI
- The meetup feature is structured around typed models plus a swappable service layer in [services/meetups](/Users/shawmiller/Developer/projects/peakpartner/services/meetups)

## Notes

- The onboarding completion flag is currently stored in local app state to keep the scaffold simple. The intended next step is persisting that state in `profiles.onboarding_completed`.
- Meetup persistence is mocked in memory through the provider in [components/meetups/MeetupProvider.tsx](/Users/shawmiller/Developer/projects/peakpartner/components/meetups/MeetupProvider.tsx). Swapping that provider to Supabase queries and mutations is the intended next backend step.
- Age-gating for public stranger discovery is implemented in the application logic for this pass. The schema includes notes for mirroring that rule at the query or database-policy layer later.
