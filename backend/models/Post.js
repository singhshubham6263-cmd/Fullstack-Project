const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userAvatar: String,
  content: {
    type: String,
    required: [true, 'Please add some content']
  },
  tags: [String],
  languagePair: String,
  type: {
    type: String,
    enum: ['Cultural Question', 'Translation Request'],
    default: 'Cultural Question'
  },
  votes: {
    type: Number,
    default: 0
  },
  replies: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      userName: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
