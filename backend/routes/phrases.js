const express = require('express');
const { getPhrases, addPhrase, updatePhrase, deletePhrase } = require('../controllers/phrases');

const router = express.Router();

router.route('/')
  .get(getPhrases)
  .post(addPhrase);

router.route('/:id')
  .put(updatePhrase)
  .delete(deletePhrase);

module.exports = router;
