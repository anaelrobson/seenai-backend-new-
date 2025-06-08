const express = require('express');
const app = express();
app.use(express.json());

app.post('/analyze-tone', (req, res) => {
  const { transcript } = req.body;
  if (typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Transcript must be provided as text' });
  }
  res.json({ tone: 'pending', summary: 'pending' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tone service running on port ${PORT}`);
});

module.exports = app;
