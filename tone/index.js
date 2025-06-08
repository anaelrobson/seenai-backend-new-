require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

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

app.post('/analyze-tone', async (req, res) => {
  const { transcript } = req.body;
  if (typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Transcript must be provided as text' });
  }

  const metrics = calculateMetrics(transcript);

  try {
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
      // If parsing fails, wrap it in object
      data = { output: data };
    }
    res.json({ ...data, raw_metrics: metrics });
  } catch (err) {
    console.error(err.response ? err.response.data : err);
    res.status(500).json({ error: 'Failed to analyze tone' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tone service running on port ${PORT}`);
});

module.exports = app;
