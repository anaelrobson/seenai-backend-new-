# seenai-backend-new
od76wv-codex/build-backend-to-analyze-video-with-whisper-api

This repo contains a single Express service located in the `transcription` folder.

The `/analyze` endpoint accepts a video file, sends it to OpenAI Whisper to generate a transcript, then performs tone analysis using GPT-3.5. The response includes both the transcript and tone details.

Create an `.env` file with `OPENAI_API_KEY` before running.

## Running locally

```bash
cd transcription
npm install
node index.js
```
=======
4o8ksg-codex/build-backend-to-analyze-video-with-whisper-api

This repo contains two independent Express services that can be deployed separately on Render.

- **transcription/** – exposes `/analyze` to send a video file to OpenAI Whisper, fetch tone analysis from the tone service and return both results.
- **tone/** – exposes `/analyze-tone` which accepts a transcript, computes speaking metrics and asks OpenAI for a tone analysis.

Each folder has its own `package.json` and can be deployed individually.

Both services expect an `.env` file with `OPENAI_API_KEY`. The transcription
service can optionally use `TONE_API_URL` to override the URL of the tone
analysis endpoint.

## Running locally

```
cd tone
npm install
node index.js

cd ../transcription
npm install
node index.js

lol
 temp
main
