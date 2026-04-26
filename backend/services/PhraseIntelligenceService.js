const Phrase = require('../models/Phrase');

class PhraseIntelligenceService {
  /**
   * Scans text and replaces regional phrases with generic meanings
   * @param {string} text - The input text to process
   * @param {string} sourceLanguage - The language code (e.g., 'en')
   * @param {string} sourceRegion - The region code (e.g., 'US', 'UK', 'IN')
   * @returns {Object} - Object containing processedText and array of replaced phrases
   */
  async processText(text, sourceLanguage, sourceRegion) {
    if (!text || !sourceLanguage || !sourceRegion) {
      return { processedText: text, phrasesReplaced: [] };
    }

    // Fetch relevant phrases for the given language and region
    const phrases = await Phrase.find({
      language: sourceLanguage,
      region: sourceRegion
    });

    if (!phrases || phrases.length === 0) {
      return { processedText: text, phrasesReplaced: [] };
    }

    let processedText = text;
    const phrasesReplaced = [];

    // Sort phrases by length descending, so longer phrases are replaced first
    // (e.g., "piece of cake" should be replaced before "cake")
    phrases.sort((a, b) => b.originalPhrase.length - a.originalPhrase.length);

    for (const phraseObj of phrases) {
      // Create a case-insensitive regex for the exact phrase
      // \b ensures we match whole words
      const regex = new RegExp(`\\b${this.escapeRegExp(phraseObj.originalPhrase)}\\b`, 'gi');
      
      if (regex.test(processedText)) {
        processedText = processedText.replace(regex, phraseObj.genericMeaning);
        phrasesReplaced.push({
          originalPhrase: phraseObj.originalPhrase,
          genericMeaning: phraseObj.genericMeaning
        });
      }
    }

    return { processedText, phrasesReplaced };
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
}

module.exports = new PhraseIntelligenceService();
