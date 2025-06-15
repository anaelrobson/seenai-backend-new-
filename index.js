bohc7z-codex/build-backend-to-analyze-video-with-whisper-api
require('dotenv').config();
const express = require('express');
const transcriptionRouter = require('./routes/transcription');
const { router: toneRouter } = require('./routes/tone');

const app = express();

app.use('/analyze', transcriptionRouter);
app.use('/analyze-tone', toneRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

require('./transcription');
 main
