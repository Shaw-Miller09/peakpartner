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
  onboarding/          Onboarding-specific UI helpers
hooks/                 App hooks
lib/                   External clients and app services
models/                Frontend domain models
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

## Current scaffold coverage

- Supabase client setup with persistent auth storage
- Auth screens for sign in and sign up
- Three-step onboarding flow scaffold
- Core route groups for app navigation
- Placeholder screens for home, meetup discovery, create meetup, chat, profile, video posts, and GPS tracking
- Frontend profile and meetup models
- SQL schema for social, meetup, messaging, ratings, media, and GPS session data

## Notes

- The onboarding completion flag is currently stored in local app state to keep the scaffold simple. The intended next step is persisting that state in `profiles.onboarding_completed`.
- The placeholder screens are intentionally light on UI and optimized for future implementation work.
