var problemModel = function(connection) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var solutionModel = mongoose.model('Solution');

    var problemSchema = mongoose.Schema({
        name: { type: String, required: true },
        href: { type: String, required: true },
        tags: { type: [String], required: false },
        abstract: { type: String, required: true },
        assumptions: { type: [String], required: false },
        edgecases: { type: [String], required: false },
        solutions: { type: [{ type: Schema.Types.ObjectId, ref: 'Solution' }], required: false },
        dtCreated: { type: Date, required: true, default: Date.now },
        creator: { type: String, required: true },
        dtEdited: { type: Date, required: true, default: Date.now },
        editor: { type: String, required: true }
    }, { collection: 'Problems' });

    return connection.model('Problem', problemSchema);
};
module.exports = problemModel;