# 144K - Exclusive Community App

An exclusive, invite-only app for building a community of 144,000 passionate change-makers working together to make a positive impact on the world.

## Features

- **Invite-Only System**: Users can only join with a valid invite code
- **Automatic Invite Generation**: New users receive 2 invite codes to share
- **Real-time Updates**: WebSocket integration for live community updates
- **Exclusive UI/UX**: Beautiful, modern design with glass morphism effects
- **Progress Tracking**: Real-time community growth visualization
- **MongoDB Integration**: Scalable database with proper schema design

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB Atlas
- **Real-time**: Socket.IO for WebSocket connections
- **Animations**: Framer Motion for smooth UI transitions
- **Icons**: Lucide React for consistent iconography

## Database Schema

### Users Collection

```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "joinedAt": "Date",
  "generatedInvites": ["string"],
  "invitedBy": "string",
  "isActive": "boolean"
}
```

### Invites Collection

```json
{
  "_id": "string (invite code)",
  "generatedBy": "ObjectId",
  "createdAt": "Date",
  "usedAt": "Date (optional)",
  "usedBy": "ObjectId (optional)"
}
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/144k?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Next.js App URL
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# WebSocket Configuration
SOCKET_PORT=3001
```

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database named `144k`
4. Create collections: `users` and `invites`
5. Get your connection string and update `MONGODB_URI`

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database

```bash
# Run the database initialization script
npx ts-node src/scripts/init-db.ts
```

This will create the first user (founder) and generate initial invite codes.

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## How It Works

### User Flow

1. **Landing Page**: Users see the exclusive community with current stats
2. **Invite Validation**: Users enter their invite code for validation
3. **Registration**: Valid invite codes allow users to register with name and email
4. **Welcome**: New users receive 2 invite codes to share with others
5. **Real-time Updates**: All users see live community growth

### Invite System

- Each user gets exactly 2 invite codes upon joining
- Invite codes are single-use and automatically invalidated
- Codes follow the format: `CODE-{PREFIX}-{SUFFIX}` (e.g., `CODE-ALPHA-01`)
- The system tracks who generated each invite and when it was used

### Real-time Features

- Live community member count updates
- New member notifications
- Progress bar animations
- WebSocket connections for instant updates

## API Endpoints

### POST `/api/auth/register`

Register a new user with an invite code.

**Body:**

```json
{
  "name": "string",
  "email": "string",
  "inviteCode": "string"
}
```

### POST `/api/auth/validate-invite`

Validate an invite code.

**Body:**

```json
{
  "inviteCode": "string"
}
```

### GET `/api/stats`

Get current community statistics.

**Response:**

```json
{
  "totalUsers": "number",
  "availableInvites": "number",
  "maxUsers": 144000,
  "progressPercentage": "number",
  "remainingSlots": "number"
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

This is a startup competition project. The codebase is designed to be:

- **Fast to deploy**: Minimal setup required
- **Scalable**: MongoDB Atlas handles growth
- **Maintainable**: Clean TypeScript code with proper error handling
- **User-friendly**: Intuitive UI with smooth animations

## License

This project is created for the startup competition and is not open source.

## Support

For questions or issues, please contact the development team.
