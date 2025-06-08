# seenai-backend-new

Simple Express.js backend that exposes a `/analyze` endpoint to transcribe video files using OpenAI's Whisper API.

## Setup

```bash
npm install
```

Create a `.env` file with your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

## Usage

Start the server:

```bash
npm start
```

Send a POST request to `/analyze` with a form field named `video` containing the video file. The service will return JSON:

```json
{ "transcript": "..." }
```
