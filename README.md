# AI Resume Builder

A production-ready AI SaaS platform that helps users optimize their resumes, prepare for job searches, and connect with matching job listings — powered by OpenAI, Next.js, and a conversational AI career coach.

---

## Features

- Resume upload (PDF, DOCX, TXT) with AI-powered parsing
- Conversational AI career coaching (streaming chat)
- ATS-optimized resume generation
- Job search and matching (Adzuna API)
- Resume scoring (0–100)
- Cover letter generation
- PDF and DOCX export
- Authentication via Clerk
- Dark mode

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + ShadCN UI |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Auth | Clerk |
| File Storage | UploadThing |
| AI | OpenAI GPT-4o via Vercel AI SDK |
| Job Search | Adzuna API |
| Rate Limiting | Upstash Redis |
| Deployment | Vercel |

---

## Prerequisites

- Node.js 18+
- npm
- A PostgreSQL database (e.g. [Supabase](https://supabase.com) free tier)
- Accounts for: [Clerk](https://clerk.com), [OpenAI](https://platform.openai.com), [UploadThing](https://uploadthing.com), [Adzuna](https://developer.adzuna.com), [Upstash](https://upstash.com)

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/ajb246/ai-resume-builder.git
cd ai-resume-builder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project with the following variables:

```bash
# Database (PostgreSQL — Supabase recommended)
DATABASE_URL="postgresql://postgres:PASSWORD@db.YOURPROJECT.supabase.co:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# OpenAI
OPENAI_API_KEY="sk-..."

# UploadThing (file uploads)
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."

# Adzuna (job search)
ADZUNA_APP_ID="..."
ADZUNA_API_KEY="..."

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Where to find each value:
- **Clerk** → [clerk.com](https://clerk.com) → Your app → API Keys
- **OpenAI** → [platform.openai.com](https://platform.openai.com) → API Keys
- **UploadThing** → [uploadthing.com](https://uploadthing.com) → Your app → API Keys
- **Adzuna** → [developer.adzuna.com](https://developer.adzuna.com) → My Apps
- **Upstash** → [console.upstash.com](https://console.upstash.com) → Your Redis database → REST API

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
```

This creates all the necessary tables in your PostgreSQL database.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. If port 3000 is in use, Next.js will automatically use the next available port (e.g. 3001).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## Running the Tests

### Type Checking

Verify all TypeScript types are valid across the entire codebase:

```bash
npx tsc --noEmit
```

A clean run produces no output. Any errors will be printed with file and line number.

### Linting

Check for code style and potential errors:

```bash
npm run lint
```

### Manual Integration Testing

Since this is a full-stack AI application with external service dependencies (OpenAI, Clerk, UploadThing), the primary testing approach is integration testing through the running app. Below are the key flows to verify:

**Authentication**
1. Navigate to `http://localhost:3000`
2. Click "Get Started Free" — you should be redirected to the Clerk sign-up page
3. Sign up and confirm you land on `/dashboard`

**Resume Upload**
1. From the dashboard, click "Upload Resume"
2. Upload a PDF or DOCX resume
3. Confirm the file is parsed and you are redirected to the chat page

**AI Chat**
1. On the chat page, send a message to the AI career coach
2. Confirm the response streams in real time
3. Ask for "jobs in [city]" — confirm job listings appear in the jobs panel

**Resume Generation**
1. After several messages, click "Generate Resume"
2. Enter a target role
3. Confirm a generated resume appears in the preview panel

**Export**
1. On the generated resume tab, click "Download PDF" or "Download DOCX"
2. Confirm the file downloads correctly

---

## Project Structure

```
app/
  (marketing)/      # Public landing page
  (dashboard)/      # Protected app routes (dashboard, chat, resume, jobs)
  api/              # API route handlers
components/
  chat/             # ChatPanel, MessageBubble, TypingIndicator
  resume/           # ResumeUpload, ResumePreview, templates
  jobs/             # JobCard, JobsPanel
  dashboard/        # Sidebar, ResumeScore
  marketing/        # Hero, Features, Navbar, Footer
services/
  resume/           # Parsing, generation, scoring, export
  jobs/             # Adzuna API client, job matching
  ai/               # Prompts, embeddings
lib/                # Prisma, OpenAI, Stripe singletons
types/              # TypeScript interfaces
prisma/
  schema.prisma     # Database schema
```

---

## Deployment (Vercel)

1. Push the repository to GitHub
2. Import the project in [vercel.com](https://vercel.com)
3. Add all environment variables from the list above in **Settings → Environment Variables**
4. Deploy — Vercel will run `prisma generate && next build` automatically
