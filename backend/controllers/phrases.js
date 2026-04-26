const ErrorResponse = require('../utils/errorResponse');
const Phrase = require('../models/Phrase');

// @desc    Get all phrases
// @route   GET /api/phrases
// @access  Public
exports.getPhrases = async (req, res, next) => {
  try {
    const { language, region } = req.query;
    let query = {};
    
    if (language) query.language = language;
    if (region) query.region = region;

    const phrases = await Phrase.find(query);

    res.status(200).json({
      success: true,
      count: phrases.length,
      data: phrases
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a new phrase
// @route   POST /api/phrases
// @access  Private (Admin only in real app, but open for now)
exports.addPhrase = async (req, res, next) => {
  try {
    const phrase = await Phrase.create(req.body);

    res.status(201).json({
      success: true,
      data: phrase
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a phrase
// @route   PUT /api/phrases/:id
// @access  Private
exports.updatePhrase = async (req, res, next) => {
  try {
    let phrase = await Phrase.findById(req.params.id);

    if (!phrase) {
      return next(new ErrorResponse(`Phrase not found with id of ${req.params.id}`, 404));
    }

    phrase = await Phrase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: phrase
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a phrase
// @route   DELETE /api/phrases/:id
// @access  Private
exports.deletePhrase = async (req, res, next) => {
  try {
    const phrase = await Phrase.findById(req.params.id);

    if (!phrase) {
      return next(new ErrorResponse(`Phrase not found with id of ${req.params.id}`, 404));
    }

    await phrase.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
