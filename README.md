# seenai-backend-new

This repository contains a single Express server that provides two endpoints:

- `POST /analyze` – accepts a video file (multipart/form-data key `video`), sends it to the OpenAI Whisper API and then performs tone analysis.
- `POST /analyze-tone` – accepts `{ transcript: "..." }` and returns a tone summary with raw speech metrics.

Create a `.env` file in the project root containing your `OPENAI_API_KEY` before running.

## Running locally

```bash
npm install
npm start         # server runs on port 3000 by default
```

The server is defined in `index.js` and the route logic lives under `routes/`.
