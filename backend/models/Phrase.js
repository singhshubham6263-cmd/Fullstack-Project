const mongoose = require('mongoose');

const PhraseSchema = new mongoose.Schema({
  originalPhrase: {
    type: String,
    required: [true, 'Please add the original phrase'],
    trim: true,
  },
  genericMeaning: {
    type: String,
    required: [true, 'Please add the generic meaning or literal translation'],
    trim: true,
  },
  language: {
    type: String,
    required: [true, 'Please specify the language code (e.g., en, es, hi)'],
  },
  region: {
    type: String,
    required: [true, 'Please specify the region (e.g., US, UK, IN, MX)'],
  },
  isFuzzyMatch: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for faster lookups based on language and region
PhraseSchema.index({ language: 1, region: 1, originalPhrase: 1 });

module.exports = mongoose.model('Phrase', PhraseSchema);
