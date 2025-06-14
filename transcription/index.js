require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

function calculateMetrics(transcript) {
  const words = transcript.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = transcript.split(/[.!?]+/).filter(Boolean);
  const sentenceCount = sentences.length || 1;
  const fillerWords = ['um', 'uh', 'like', 'you know', 'i mean'];
  const fillerRegex = new RegExp(`\\b(${fillerWords.join('|')})\\b`, 'gi');
  const fillerCount = (transcript.match(fillerRegex) || []).length;
  const pauseCount = (transcript.match(/\.\.\.|[.!?]/g) || []).length;
  const avgSentenceLength = wordCount / sentenceCount;
  const estimatedMinutes = (sentenceCount * 5) / 60; // assume ~5s per sentence
  const wordsPerMinute = estimatedMinutes ? wordCount / estimatedMinutes : wordCount;
  return {
    words_per_minute: Math.round(wordsPerMinute),
    filler_word_count: fillerCount,
    pause_count: pauseCount,
    average_sentence_length: Number(avgSentenceLength.toFixed(2)),
  };
}

async function analyzeTone(transcript) {
  const metrics = calculateMetrics(transcript);

  const prompt = [
    {
      role: 'system',
      content: 'You analyze a speaking transcript and return tone information in JSON.'
    },
    {
      role: 'user',
      content:
        `Transcript:\n${transcript}\n\nMetrics:\n${JSON.stringify(metrics, null, 2)}\n\n` +
        'Provide a JSON response with keys summary, tone_description, raw_tone, and ratings (clarity, confidence, pacing, emotional_intensity from 1-10).'
    }
  ];

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: prompt,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  let data = response.data.choices[0].message.content.trim();
  try {
    data = JSON.parse(data);
  } catch (e) {
    data = { output: data };
  }
  return { ...data, raw_metrics: metrics };
}

app.post('/analyze', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append('model', 'whisper-1');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const transcript = response.data.text;

    // Analyze the transcript locally for tone
    const toneData = await analyzeTone(transcript);

    // Combine transcript with tone analysis response
    res.json({ transcript, ...toneData });
  } catch (err) {
    console.error(err.response ? err.response.data : err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
