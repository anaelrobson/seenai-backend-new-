# seenai-backend-new

This repo contains two independent Express services that can be deployed separately on Render.

- **transcription/** – exposes `/analyze` to send a video file to OpenAI Whisper, fetch tone analysis from the tone service and return both results.
- **tone/** – exposes `/analyze-tone` which accepts a transcript, computes speaking metrics and asks OpenAI for a tone analysis.

Each folder has its own `package.json` and can be deployed individually.

Both services expect `OPENAI_API_KEY` in the environment. The transcription
service can optionally use `TONE_API_URL` to override the URL of the tone
analysis endpoint.
