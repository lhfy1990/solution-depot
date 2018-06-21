var userModel = function(connection) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var problemModel = mongoose.model('Problem');
    var notebookModel = mongoose.model('Notebook');

    var userProblemSchema = new Schema({
        problem: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
        dtReviewed: { type: Date, required: true, default: Date.now }
    }, { _id: false });
    var userSchema = mongoose.Schema({
        _id: { type: String, lowercase: true, trim: true, required: true },
        nickname: {type: String, trim: true, required: false},
        password: { type: String, trim: true, required: true },
        notebook: { type: Schema.Types.ObjectId, ref: 'Notebook', required: false },
        problems: { type: [userProblemSchema], required: true },
        dtCreated: { type: Date, required: true, default: Date.now }
    }, { collection: 'Users' });

    return connection.model('User', userSchema);
};
module.exports = userModel;