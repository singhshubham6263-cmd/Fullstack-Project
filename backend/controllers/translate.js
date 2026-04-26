const ErrorResponse = require('../utils/errorResponse');
const Translation = require('../models/Translation');
const TranslationService = require('../services/TranslationService');
const PhraseIntelligenceService = require('../services/PhraseIntelligenceService');

// @desc    Translate text with intelligence
// @route   POST /api/translate
// @access  Public (or Private depending on requirements, using Public for now but saving history if user logged in)
exports.translateText = async (req, res, next) => {
  try {
    const { text, sourceLanguage, targetLanguage, sourceRegion } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return next(new ErrorResponse('Please provide text, sourceLanguage, and targetLanguage', 400));
    }

    // Step 1: Pass text through Phrase Intelligence Service
    const { processedText, phrasesReplaced } = await PhraseIntelligenceService.processText(
      text,
      sourceLanguage,
      sourceRegion
    );

    // Step 2: Translate the processed text
    const translatedText = await TranslationService.translate(
      processedText,
      sourceLanguage,
      targetLanguage
    );

    // Step 3: Save to database (async, no need to await for response unless we want the ID)
    let translationRecord = null;
    try {
      translationRecord = await Translation.create({
        user: req.user ? req.user.id : undefined,
        originalText: text,
        translatedText,
        sourceLanguage,
        targetLanguage,
        sourceRegion,
        phrasesReplaced
      });
    } catch (dbErr) {
      console.error("Failed to save translation history:", dbErr);
      // We don't fail the request if saving history fails
    }

    res.status(200).json({
      success: true,
      data: {
        originalText: text,
        processedText,
        translatedText,
        phrasesReplaced,
        historyId: translationRecord ? translationRecord._id : null
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get translation history for logged in user
// @route   GET /api/translate/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    if (!req.user) {
        return next(new ErrorResponse('Not authorized', 401));
    }
    const history = await Translation.find({ user: req.user.id }).sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    next(err);
  }
};
