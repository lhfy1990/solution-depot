var solutionModel = function(connection) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var solutionSchema = mongoose.Schema({
        language: { type: String, required: true, default: 'Pseudocode' },
        code: { type: String, required: true, default: 'Please type in your code here' },
        complexity: { type: String, required: true, default: 'Please provide complexity' },
        explanation: { type: String, required: false },
        tags: { type: [String], required: false },
        isPrivate: { type: Boolean, required: true, default: true },
        reviewers: { type: [String], required: false },
        dtCreated: { type: Date, required: true, default: Date.now },
        creator: { type: String, required: true },
        dtEdited: { type: Date, required: true, default: Date.now },
        editor: { type: String, required: true }
    }, { collection: 'Solutions' });

    return connection.model('Solution', solutionSchema);
};
module.exports = solutionModel;