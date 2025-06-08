# seenai-backend-new

This repo contains two independent Express services that can be deployed separately on Render.

## Services

### `/transcription`
- Endpoint: `POST /analyze`
- Accepts: video file (form-data, key = `video`)
- Sends the video to OpenAI Whisper API and returns the transcript.

### `/tone`
- Endpoint: `POST /analyze-tone`
- Accepts: plain text transcript
- (Currently returns placeholder tone + summary — will be updated to use GPT-4.)

Each folder has its own `package.json` and can be deployed independently by pointing Render to the correct subdirectory.

---

## Running Locally

### Transcription
```bash
cd transcription
npm install
npm start
## Services
