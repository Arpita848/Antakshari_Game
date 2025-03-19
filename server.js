const express = require('express');
const mongoose = require('mongoose');
const Word = require('./models/wordModel');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/wordAntakshari')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
  // Game Variables
let currentWord = '';
let score = 0;

// Start Game
app.get('/', async (req, res) => {
  const randomWord = await Word.aggregate([{ $sample: { size: 1 } }]);
  currentWord = randomWord[0].word;
  res.render('index', { currentWord, score, message: '' });
});

// Game Logic
app.post('/play', async (req, res) => {
  const userWord = req.body.userWord.toLowerCase();

  if (!userWord.startsWith(currentWord.slice(-1))) {
    return res.render('index', {
      currentWord,
      score,
      message: `Invalid word! Must start with "${currentWord.slice(-1).toUpperCase()}".`
    });
  }

  const isValid = await Word.findOne({ word: userWord });

  if (isValid) {
    score += userWord.length;
    currentWord = userWord;
    res.render('index', { currentWord, score, message: 'Correct! Keep going!' });
  } else {
    res.render('index', {
      currentWord,
      score,
      message: 'Invalid word! Game Over.'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});