# seenai-backend-new

This repo contains two independent Express services that can be deployed separately on Render.

## Services

### `/transcription`
- Endpoint: `POST /analyze`
- Accepts: video file (form-data, key = `video`)
- Sends the video to OpenAI Whisper and fetches tone analysis from the tone service

### `/tone`
- Endpoint: `POST /analyze-tone`
- Accepts: plain text transcript
- Computes raw speech metrics + sends it to OpenAI GPT for analysis

Each folder has its own `package.json` and can be deployed independently.

Both services expect `OPENAI_API_KEY` in the environment.  
The transcription service can optionally use `TONE_API_URL` to override the URL of the tone analysis endpoint.
