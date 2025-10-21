# Ansh & Noahh Chat App

A beautiful real-time chat application built for two users with support for text messages, voice notes, and image sharing.

## Features

- 🔒 App password protection (1958)
- 👥 Two-user authentication system
- 💬 Real-time text messaging
- 🎤 Voice note recording and playback
- 📸 Image sharing with previews
- ✨ Beautiful animations and gradients
- 📱 Mobile-ready with Capacitor

## Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Building for Production

```bash
# Build the app
npm run build
```

## Capacitor Mobile Setup

To run on iOS or Android:

1. Export to your GitHub repository via the "Export to Github" button
2. Clone the project from your GitHub repository
3. Run `npm install` to install dependencies
4. Add iOS and/or Android platforms:
   ```bash
   npx cap add ios
   npx cap add android
   ```
5. Update native platform dependencies:
   ```bash
   npx cap update ios
   # or
   npx cap update android
   ```
6. Build the project:
   ```bash
   npm run build
   ```
7. Sync with native platforms:
   ```bash
   npx cap sync
   ```
8. Run on device/emulator:
   ```bash
   npx cap run android
   # or
   npx cap run ios  # Requires Mac with Xcode
   ```

Note: After pulling updates from GitHub, always run `npx cap sync` to sync changes to native platforms.

## User Credentials

### App Password
Password: `1958`

### User 1 (Ansh)
- Username: `Ansh`
- Password: `1Ajsidhu#`

### User 2 (Noahh)
- Username: `Noahh`
- Password: `Noahh12`

## GitHub Actions

The project includes a GitHub Actions workflow that automatically builds the app on every push to the main branch.

Make sure to add these secrets to your GitHub repository:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Mobile**: Capacitor
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx    # Main chat UI
│   │   ├── LoginForm.tsx        # User login
│   │   ├── PasswordLock.tsx     # App password screen
│   │   ├── MessageBubble.tsx    # Message display
│   │   ├── VoiceRecorder.tsx    # Voice note recording
│   │   └── ImageUpload.tsx      # Image upload
│   ├── pages/
│   │   └── Index.tsx            # Main app entry
│   └── integrations/
│       └── supabase/            # Backend integration
├── capacitor.config.ts          # Capacitor configuration
└── .github/
    └── workflows/
        └── build.yml            # CI/CD workflow
```

## Development

The app uses Lovable Cloud for backend services including:
- Database for storing messages and users
- Real-time subscriptions for instant message delivery
- Storage for voice notes and images

All backend features are automatically provisioned and require no external accounts.
