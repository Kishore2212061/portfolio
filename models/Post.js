// models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  emailSubject: { type: String },
  message: { type: String }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
