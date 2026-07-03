# Recall — Product Requirements Document

## One-liner
A study assistant that turns your own notes and lecture PDFs into a searchable, quiz-generating knowledge base — ask questions and get answers grounded in *your* material with citations, and auto-generate quizzes and flashcards straight from the source.

## Problem
Students study from scattered PDFs, lecture slides, and textbook chapters. Finding a specific concept means scrolling through documents; generic AI chatbots invent answers and can't point to your material; and making quizzes or flashcards by hand is slow. There's no tool that answers *from your own notes* and shows its work.

## Target user
Students and self-learners revising from their own document sets — course notes, lecture slides, textbook chapters.

## Goals
- Answer questions grounded strictly in the user's uploaded material, with citations to the exact source.
- Auto-generate quizzes and flashcards from the content, each item traceable to where it came from.
- Keep every user's material private and isolated.

## Non-goals (v1)
No shared or public study sets, no collaboration, no mobile app. Answers come only from uploaded documents — no web search or outside knowledge. PDF input only.

## Core features (v1)
- Email + password auth; all data scoped strictly to the owner.
- Study sets — group documents by subject or topic (e.g. "DBMS Finals").
- PDF upload with **incremental ingestion** (extract text → chunk → embed → store), showing a processing → ready → failed status so a large file never blocks on a single request.
- Grounded Q&A: ask a question, get a **streamed** answer with **citations** to the exact document, page, and passage.
- "That isn't in your notes" — when retrieval similarity is below a threshold, the app refuses instead of hallucinating.
- Quiz + flashcard generation from a study set, each item linked back to its source chunk.
- One-click guest demo seeded with a sample chapter.

## Data model
`User` 1—* `StudySet` 1—* `Document` 1—* `Chunk`. Chat and generated items hang off the user and study set.

| Entity | Key fields |
| --- | --- |
| User | id, email, passwordHash, createdAt |
| StudySet | id, userId (FK), title, createdAt |
| Document | id, studySetId (FK), title, filename, status (processing / ready / failed), createdAt |
| Chunk | id, documentId (FK), content, **embedding (vector)**, page, chunkIndex, tokenCount |
| Conversation | id, userId (FK), studySetId (FK), title, createdAt |
| Message | id, conversationId (FK), role (user / assistant), content, createdAt |
| Citation | id, messageId (FK), chunkId (FK) |
| Question | id, studySetId (FK), type (quiz / flashcard), prompt, answer, sourceChunkId (FK) |

## Tech stack (₹0 — no paid services, no credit card)
Next.js (App Router) + TypeScript, PostgreSQL **with pgvector** via Prisma (Neon free tier), Auth.js, Tailwind. Generation and embeddings via the **Gemini free tier** — Flash-Lite for answers, Gemini embeddings for vectors. PDF text extraction with `unpdf`. Deployed on Vercel Hobby.

## Success criteria
- Deployed and publicly reachable.
- A guest can try it on seeded material in one click.
- Upload → processing → ready completes reliably via incremental ingestion (stays inside Vercel's function timeout).
- Answers cite the exact source; low-confidence questions are refused, not hallucinated.
- Quiz and flashcard generation works, with each item traceable to its source chunk.
- Every vector query is authorization-scoped to the user.
- Runs entirely on free tiers (₹0).
- Clean README with live link and screenshots.

## Future (v2+)
- Shared / public study sets.
- More input formats (DOCX, PPTX, image OCR).
- Spaced-repetition flashcard review.
- Highlight-to-ask directly from a source document viewer.
- Local embeddings option (Transformers.js) to remove the API dependency entirely.