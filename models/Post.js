const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    emailSubject: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post10', postSchema);

module.exports = Post;
