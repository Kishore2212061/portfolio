const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
    viewCount: { type: Number, default: 0 }
});

const View = mongoose.model('View', viewSchema);

module.exports = View;
