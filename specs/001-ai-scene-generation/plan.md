# Implementation Plan: AI-Powered Scene Generation

**Branch**: `001-ai-scene-generation` | **Date**: 2025-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-scene-generation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add AI-powered scene breakdown generation to the Content Memori ideas management application. Users can click a sparkles icon button in the draft detail view to automatically generate structured scene analyses (visual scenes, camera angles, key moments) from their video scripts using OpenAI SDK. The feature includes inline editing, unlimited generation history, and maintains strict user data isolation via Row Level Security (RLS). Technical approach uses Next.js 16 Server Components with client-side interactivity for AI generation, Supabase for storage/realtime, and OpenAI API for text generation.

## Technical Context

**Language/Version**: TypeScript 5.7 (strict mode enabled)
**Primary Dependencies**:
- Next.js 16.0.10 (App Router with Server Components)
- React 19.2.0
- Supabase JS Client 2.89.0
- OpenAI SDK (NEEDS CLARIFICATION: version selection)
- Zod 3.25.76 (runtime validation)
- Lucide React 0.454.0 (sparkles icon)

**Storage**: Supabase PostgreSQL with existing `ideas` table, new columns for scene breakdown and generation history

**Testing**: Tests OPTIONAL per constitution - not requested in spec

**Target Platform**: Web (browser-based application)

**Project Type**: web (Next.js single-project architecture)

**Performance Goals**:
- Scene generation completes in under 15 seconds (SC-001)
- Support up to 10 concurrent generation requests (SC-007)
- Real-time sync of scene breakdown changes across all connected clients

**Constraints**:
- Must not expose OpenAI API keys to client-side code (environment variables only)
- Scene breakdown stored as single TEXT field (max 65,535 bytes for PostgreSQL TEXT)
- Script content practical limit 5,000 characters (assumption #5)

**Scale/Scope**:
- Single user feature (no collaborative editing per RLS)
- Unlimited generation history retention per draft
- Supports 3+ languages (English, Indonesian, Spanish)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Security-First Authentication ✅ PASS
- ✅ FR-016, FR-017, FR-018 enforce user ownership and RLS
- ✅ Database operations require Supabase Auth
- ✅ API keys (OpenAI) stored in environment variables, server-side only
- ✅ RLS policies prevent cross-user data access

### Principle II: Real-Time Responsiveness ✅ PASS
- ✅ Scene breakdown changes must sync via Supabase Realtime
- ✅ Inline edits immediately reflected across connected clients
- ✅ Realtime connection error handling required

### Principle III: Type Safety & Validation ✅ PASS
- ✅ TypeScript strict mode enforced
- ✅ New database columns require TypeScript interface updates
- ✅ Zod schemas for user input validation (script content, scene breakdown text)
- ✅ Supabase type generation after schema changes

### Principle IV: Progressive Enhancement ✅ PASS
- ✅ Server Components for draft detail view (performance)
- ✅ Client Component only for sparkles button (interactivity)
- ✅ Loading states for AI generation (FR-003)
- ✅ Error boundaries for AI service failures (FR-005, FR-009)

### Principle V: Data Consistency ✅ PASS
- ✅ Database triggers for `updated_at` timestamps (existing pattern)
- ✅ Schema migration for new columns (scene_breakdown, related tables)
- ✅ Foreign key constraints for generation history
- ✅ Zod validation at application layer, database constraints at storage layer

**Gate Result**: PASS - No constitution violations. All principles satisfied by specification requirements.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-scene-generation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── scene-breakdown-api.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── components/
│   ├── detail-modal.tsx           # Existing - MODIFY for scene breakdown UI
│   └── scene-breakdown-editor.tsx # NEW - Client component for inline editing
lib/
├── supabase.ts                    # Existing - MODIFY for new types
├── openai.ts                      # NEW - OpenAI client, API route handlers
└── types.ts                       # NEW or MODIFY - TypeScript interfaces for scene breakdown
app/
├── api/
│   └── generate-scene-breakdown/
│       └── route.ts               # NEW - API route for OpenAI generation (server-side)
supabase-migrations/
└── 20250105_add_scene_breakdown.sql  # NEW - Database migration
```

**Structure Decision**: This is a Next.js 16 web application using the App Router pattern. The project follows a single-project structure with:
- `app/` for Next.js App Router (pages, layouts, API routes)
- `app/components/` for React components
- `lib/` for shared utilities and clients
- Database migrations via Supabase SQL Editor (version-controlled in `supabase-migrations/`)

New feature adds:
1. Client component for interactive sparkles button and inline editing
2. Server-side API route for secure OpenAI integration
3. Database migration for scene breakdown storage and generation history
4. TypeScript types for new data structures

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations. This section intentionally left blank.
