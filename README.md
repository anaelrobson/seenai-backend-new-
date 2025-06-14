# seenai-backend-new

This repo contains a single Express service located in the `transcription` folder.

The `/analyze` endpoint accepts a video file, sends it to OpenAI Whisper to generate a transcript, then performs tone analysis using GPT-3.5. The response includes both the transcript and tone details.

Create an `.env` file with `OPENAI_API_KEY` before running.

## Running locally

```bash
cd transcription
npm install
node index.js
```
