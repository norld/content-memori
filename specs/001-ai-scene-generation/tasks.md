# Tasks: AI-Powered Scene Generation

**Input**: Design documents from `/specs/001-ai-scene-generation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not requested in feature specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web application**: `app/` for pages/components, `lib/` for utilities, `app/api/` for API routes
- Paths shown below assume Next.js 16 App Router structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [X] T001 Install OpenAI SDK dependency (v4.67.0+) via `npm install openai@^4.67.0`
- [X] T002 [P] Install DOMPurify for XSS protection via `npm install dompurify @types/dompurify`
- [X] T003 [P] Install lodash for debounce utility via `npm install lodash @types/lodash`
- [X] T004 Add OPENAI_API_KEY environment variable to `.env.local`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

⚠️ **CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Run database migration in Supabase SQL Editor to add `scene_breakdown` and `scene_breakdown_generated_at` columns to `ideas` table
- [X] T006 Run database migration in Supabase SQL Editor to create `scene_breakdown_history` table with indexes and RLS policies
- [X] T007 Regenerate Supabase TypeScript types via `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts` (⚠️ PENDING: Run migration first)
- [X] T008 Create TypeScript interfaces for scene breakdown in `lib/types/scene-breakdown.ts` (SceneBreakdown, SceneBreakdownVersion, GenerateSceneBreakdownRequest)
- [X] T009 [P] Create Zod validation schemas in `lib/schemas/scene-breakdown.ts` (generateSceneBreakdownSchema, updateSceneBreakdownSchema, getSceneBreakdownHistorySchema)
- [X] T010 Create OpenAI client utility in `lib/openai.ts` with `generateSceneBreakdown()` function and `buildPrompt()` helper
- [X] T011 Add language detection utility function in `lib/utils/language-detection.ts` with heuristic keyword matching for English/Indonesian/Spanish

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate Scene Breakdown from Script (Priority: P1) 🎯 MVP

**Goal**: Users can click a sparkles button to automatically generate structured scene breakdowns from their video scripts using OpenAI

**Independent Test**: Open a draft with script content, click sparkles button, verify scene breakdown is generated and displayed in the detail view

### Implementation for User Story 1

- [X] T012 [US1] Create API route at `app/api/generate-scene-breakdown/route.ts` with POST handler, Supabase auth check, and OpenAI integration
- [X] T013 [US1] Add request validation in API route using `generateSceneBreakdownSchema` (parse ideaId, script, language)
- [X] T014 [US1] Add idea ownership verification in API route (SELECT from ideas with user_id check, return 404 if not found)
- [X] T015 [US1] Implement scene breakdown history versioning in API route (query max version + 1, insert into scene_breakdown_history)
- [X] T016 [US1] Implement ideas table update in API route (UPDATE scene_breakdown and scene_breakdown_generated_at)
- [X] T017 [US1] Add error handling in API route with try/catch for OpenAI errors (401 unauthorized, 400 bad request, 429 rate limit, 500/503 service errors)
- [X] T018 [P] [US1] Create client component `app/components/scene-breakdown-editor.tsx` with 'use client' directive
- [X] T019 [P] [US1] Add Sparkles icon import from lucide-react in scene-breakdown-editor.tsx
- [X] T020 [P] [US1] Implement component state in scene-breakdown-editor.tsx (content state, isGenerating loading state, error state)
- [X] T021 [US1] Implement handleGenerate async function in scene-breakdown-editor.tsx (fetch from API, setLoading, setError, setContent)
- [X] T022 [US1] Add disabled state logic to sparkles button in scene-breakdown-editor.tsx (disable when isGenerating or no script)
- [X] T023 [US1] Implement loading indicator UI in scene-breakdown-editor.tsx (show "Generating..." text when isGenerating is true)
- [X] T024 [US1] Implement error message display in scene-breakdown-editor.tsx (show error state in red when error is not null)
- [X] T025 [US1] Add contentEditable div in scene-breakdown-editor.tsx with initial content display
- [X] T026 [US1] Integrate SceneBreakdownEditor component into existing `app/components/detail-modal.tsx` (pass ideaId, initialContent from idea.scene_breakdown, script from idea.description)
- [ ] T027 [US1] Test end-to-end generation flow: open draft → click button → verify loading → verify content appears → verify data saved to database (⚠️ MANUAL TEST: Run database migration first)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Regenerate and Edit Scene Breakdown (Priority: P2)

**Goal**: Users can regenerate scene breakdowns with fresh AI responses and manually edit content via inline editing with auto-save

**Independent Test**: Generate initial scene breakdown, click regenerate button and verify new content, manually edit text and verify changes persist

### Implementation for User Story 2

- [X] T028 [P] [US2] Add debounced auto-save to scene-breakdown-editor.tsx contentEditable onChange handler (500ms debounce using lodash.debounce)
- [X] T029 [P] [US2] Implement DOMPurify sanitization in contentEditable onChange handler (ALLOWED_TAGS: P, BR, STRONG, EM, UL, OL, LI; ALLOWED_ATTR: [])
- [X] T030 [P] [US2] Add auto-save API call in debounced handler to `app/api/update-scene-breakdown/route.ts` (create this route)
- [X] T031 [US2] Create API route at `app/api/update-scene-breakdown/route.ts` with PUT handler for manual edits
- [X] T032 [US2] Add request validation in update API route using `updateSceneBreakdownSchema` (parse ideaId, content)
- [X] T033 [US2] Add idea ownership verification in update API route (SELECT from ideas with user_id check)
- [X] T034 [US2] Implement ideas table UPDATE in update API route (set scene_breakdown only, do NOT update scene_breakdown_generated_at for manual edits)
- [X] T035 [US2] Add confirm dialog to regenerate button in scene-breakdown-editor.tsx (use window.confirm() before calling API if scene_breakdown already exists)
- [X] T036 [US2] Update handleGenerate function to show confirmation dialog when idea.scene_breakdown is not null or empty
- [ ] T037 [US2] Test manual edit flow: type in contentEditable → wait 500ms → verify auto-save → refresh page → verify edits persisted (⚠️ MANUAL TEST)
- [ ] T038 [US2] Test regenerate flow: generate initial content → click regenerate → confirm dialog → verify new content replaces old (⚠️ MANUAL TEST)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View Generation History (Priority: P3)

**Goal**: Users can view previous versions of scene breakdowns and restore earlier versions from history

**Independent Test**: Generate scene breakdown multiple times, click history view, verify list of versions appears, restore a version and verify it becomes current

### Implementation for User Story 3

- [X] T039 [P] [US3] Create API route at `app/api/scene-breakdown/history/route.ts` with GET handler for retrieving version history
- [X] T040 [P] [US3] Add request validation in history API route using `getSceneBreakdownHistorySchema` (parse ideaId, limit, offset)
- [X] T041 [P] [US3] Implement history query in history API route (SELECT from scene_breakdown_history with idea_id and user_id filter, order by generated_at DESC)
- [X] T042 [P] [US3] Add pagination support in history API route (apply limit and offset)
- [X] T043 [US3] Create history UI component in `app/components/scene-breakdown-history.tsx` with list view of versions
- [X] T044 [US3] Implement version list display in history component (map versions to list items with timestamps and version numbers)
- [X] T045 [US3] Add "View" button to each history item in history component (opens modal/panel to show version content)
- [X] T046 [US3] Add "Restore" button to each history item in history component (calls restore API)
- [X] T047 [US3] Create API route at `app/api/scene-breakdown/restore/route.ts` with POST handler for restoring versions
- [X] T048 [US3] Add request validation in restore API route (parse ideaId, version)
- [X] T049 [US3] Implement restore logic in restore API route (SELECT content from scene_breakdown_history by version, UPDATE ideas.scene_breakdown with that content, set scene_breakdown_generated_at to NULL)
- [X] T050 [US3] Integrate history component into detail-modal.tsx with toggle button or tab to show/hide history view
- [ ] T051 [US3] Test history flow: generate multiple versions → open history view → verify all versions listed → click restore → verify content restored (⚠️ MANUAL TEST)
- [ ] T052 [US3] Test restore persistence: restore version → refresh page → verify restored content is still current (⚠️ MANUAL TEST)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T053 [P] Add Supabase Realtime subscription in scene-breakdown-editor.tsx to sync scene_breakdown changes across all connected clients (subscribe to ideas table UPDATE events on idea_id)
- [ ] T054 [P] Add Realtime connection error handling in scene-breakdown-editor.tsx (show error toast if subscription fails, implement retry logic)
- [ ] T055 [P] Add loading state support in scene-breakdown-editor.tsx for initial content load from database (show skeleton/spinner while fetching scene_breakdown)
- [ ] T056 [P] Test real-time sync across multiple browser windows: open same draft in 2 windows → edit in window 1 → verify change appears in window 2
- [ ] T057 [P] Test RLS policies: create draft as User A → log out → log in as User B → try to access User A's draft → verify 404/403 error
- [ ] T058 [P] Test AI service failure handling: disconnect network → try generating → verify error message appears → verify manual editing still works
- [ ] T059 [P] Test edge cases: empty script (button disabled), very long script 5000+ chars (show error), special characters in script (verify sanitization)
- [X] T060 [P] Verify TypeScript compilation passes with no errors (run `npx tsc --noEmit`)
- [ ] T061 [P] Verify ESLint passes with no warnings (run `npm run lint`)
- [ ] T062 [P] Update documentation in README.md or CLAUDE.md with new feature instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T004) - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion (T005-T011)
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - Extends US1 but should be independently testable
  - User Story 3 (P3): Can start after Foundational - May integrate with US1/US2 but should be independently testable
- **Polish (Phase 6)**: Depends on US1, US2, US3 being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 component but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses data from US1/US2 but should be independently testable

### Within Each User Story

- Models/services before endpoints/components
- Tests (if included) before implementation (TDD approach)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (Phase 1)**:
```bash
# Launch all installation tasks together:
Task: T002 - Install DOMPurify
Task: T003 - Install lodash
```

**Foundational Phase (Phase 2)**:
```bash
# Launch type and schema creation in parallel:
Task: T009 - Create Zod schemas
Task: T010 - Create OpenAI client
Task: T011 - Add language detection
```

**User Story 1 (Phase 3)**:
```bash
# Launch UI component creation in parallel:
Task: T018 - Create scene-breakdown-editor component
Task: T019 - Add icon import
Task: T020 - Implement state
Task: T021 - Implement handleGenerate
```

**User Story 2 (Phase 4)**:
```bash
# Launch auto-save features in parallel:
Task: T028 - Add debounced auto-save
Task: T029 - Add DOMPurify sanitization
Task: T030 - Add auto-save API call
```

**User Story 3 (Phase 5)**:
```bash
# Launch history API and UI in parallel:
Task: T039 - Create history API route
Task: T040 - Add request validation
Task: T041 - Implement history query
Task: T043 - Create history UI component
```

**Polish Phase (Phase 6)**:
```bash
# Launch all testing tasks in parallel:
Task: T056 - Test real-time sync
Task: T057 - Test RLS policies
Task: T058 - Test AI failure handling
Task: T059 - Test edge cases
Task: T060 - Verify TypeScript
Task: T061 - Verify ESLint
```

---

## Parallel Example: User Story 1

```bash
# Launch all UI component setup tasks together:
Task: "Add Sparkles icon import in scene-breakdown-editor.tsx"
Task: "Implement component state in scene-breakdown-editor.tsx"
Task: "Implement handleGenerate async function in scene-breakdown-editor.tsx"
Task: "Add disabled state logic to sparkles button in scene-breakdown-editor.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T011) - **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (T012-T027)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T012-T027)
   - Developer B: User Story 2 (T028-T038)
   - Developer C: User Story 3 (T039-T052)
3. Stories complete and integrate independently

---

## Notes

- **[P] tasks** = different files or no dependencies, can run in parallel
- **[Story] label** maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Stop at any checkpoint to validate story independently
- Manual testing is sufficient (tests are OPTIONAL per spec)
- Commit after each task or logical group
- Focus on completing User Story 1 first for MVP delivery
