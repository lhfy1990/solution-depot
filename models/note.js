var noteModel = function(connection) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var noteSchema = mongoose.Schema({
        text: { type: String, required: true, default: 'Please update your note text here ...' },
        tags: { type: [String], required: false },
        isPrivate: { type: Boolean, required: true, default: true },
        reviewers: { type: [String], required: false },
        dtCreated: { type: Date, required: true, default: Date.now },
        creator: { type: String, required: true },
        dtEdited: { type: Date, required: true, default: Date.now },
        editor: { type: String, required: true }
    }, { collection: 'Notes' });

    return connection.model('Note', noteSchema);
};
module.exports = noteModel;