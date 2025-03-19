const mongoose = require('mongoose');
const Word = require('./models/wordModel');

mongoose.connect('mongodb://localhost:27017/wordAntakshari')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const words = [
  'apple', 'elephant', 'tiger', 'rose', 'eagle', 'energy', 'yellow'
];

Word.insertMany(words.map(word => ({ word })))
  .then(() => console.log('Words inserted successfully'))
  .catch(err => console.error(err))
  .finally(() => mongoose.disconnect());
