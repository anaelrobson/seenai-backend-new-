require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();
router.use(express.json());

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
  const estimatedMinutes = (sentenceCount * 5) / 60; // approx 5s per sentence
  const wordsPerMinute = estimatedMinutes ? wordCount / estimatedMinutes : wordCount;
  return {
    words_per_minute: Math.round(wordsPerMinute),
    filler_word_count: fillerCount,
    pause_count: pauseCount,
    average_sentence_length: Number(avgSentenceLength.toFixed(2))
  };
}

async function analyzeTone(transcript) {
  const metrics = calculateMetrics(transcript);
  const prompt = [
    { role: 'system', content: 'You analyze a speaking transcript and respond with a short tone description.' },
    { role: 'user', content: `Transcript:\n${transcript}\n\nMetrics:\n${JSON.stringify(metrics, null, 2)}` }
  ];

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: prompt,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    }
  );

  let toneText = response.data.choices[0].message.content.trim();
  if (toneText.startsWith('{')) {
    try {
      const parsed = JSON.parse(toneText);
      toneText = parsed.tone || toneText;
    } catch (_) {}
  }
  return { tone: toneText, raw_metrics: metrics };
}

router.post('/', async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  try {
    const result = await analyzeTone(transcript);
    res.json(result);
  } catch (err) {
    console.error(err.response ? err.response.data : err);
    res.status(500).json({ error: 'Failed to analyze tone' });
  }
});

module.exports = { router, analyzeTone };
