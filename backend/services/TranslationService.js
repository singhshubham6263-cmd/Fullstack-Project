const translateAPI = require('google-translate-api-x');

class TranslationService {
  /**
   * Translates text from source language to target language
   * @param {string} text 
   * @param {string} sourceLang 
   * @param {string} targetLang 
   * @returns {string} translated text
   */
  async translate(text, sourceLang, targetLang) {
    if (!text) return '';

    try {
      console.log(`[REAL API] Translating: "${text}" from ${sourceLang} to ${targetLang}`);
      
      const res = await translateAPI(text, { 
        from: sourceLang === 'auto' ? 'auto' : sourceLang, 
        to: targetLang 
      });
      
      return res.text;
      
    } catch (error) {
      console.error("Translation API Error:", error.message);
      throw new Error("Translation service failed. Please try again later.");
    }
  }
}

module.exports = new TranslationService();
