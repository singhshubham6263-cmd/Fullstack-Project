const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false, // Optional: so guest users can also use the service without history
  },
  originalText: {
    type: String,
    required: true,
  },
  translatedText: {
    type: String,
    required: true,
  },
  sourceLanguage: {
    type: String,
    required: true,
  },
  targetLanguage: {
    type: String,
    required: true,
  },
  sourceRegion: {
    type: String,
  },
  phrasesReplaced: [
    {
      originalPhrase: String,
      genericMeaning: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Translation', TranslationSchema);
