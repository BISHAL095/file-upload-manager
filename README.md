# File Upload Manager

A Google Drive–style multi-file upload component built with React. Upload multiple files, track their progress in real time, and manage failures with retry — all with a max of 3 uploads running at once.

## Features

- Drag & drop or click to select files
- Live progress tracking per file
- Upload states: Pending, Uploading, Completed, Failed
- Retry failed uploads
- Cancel an upload mid-flight
- Concurrency limit — only 3 files upload at a time, the rest queue automatically

## Tech Stack

- React (Vite)
- `useReducer` for state management
- Native browser APIs for drag & drop
- Vitest for testing

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in your terminal.

## Running Tests

```bash
npm test
```

Covers the reducer logic and the upload simulation's async behavior (progress ticks, success/failure, cancellation).

## How It Works

Since there's no real backend, uploads are simulated — each file's progress increases in random steps every 500ms, then randomly succeeds or fails (80/20 split) once it hits 100%. This was enough to exercise real async state handling (progress updates, retries, cancellation, concurrency) without needing a server.

## Notes

- No RxJS used — this is a React implementation, so async handling is done with native timers and callbacks instead.
- Cancelling an upload removes it from the list, matching how most real upload tools (Drive, Dropbox) behave — a cancelled item has no useful "not-yet-tried" state worth showing.