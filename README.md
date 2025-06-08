# seenai-backend-new

This repo contains two independent Express services that can be deployed separately on Render.

- **transcription/** – exposes `/analyze` to send a video file to OpenAI Whisper and return the transcript.
- **tone/** – exposes `/analyze-tone` which accepts a transcript and returns placeholder tone data.

Each folder has its own `package.json` and can be deployed individually.
