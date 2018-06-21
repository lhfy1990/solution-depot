var notebookModel = function(connection) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var noteModel = mongoose.model('Note');

    var notebookSchema = mongoose.Schema({
        notes: { type: [{ type: Schema.Types.ObjectId, ref: 'Note' }], required: true }
    }, { collection: 'Notebooks' });

    return connection.model('Notebook', notebookSchema);
};
module.exports = notebookModel;