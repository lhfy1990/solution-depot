var express = require('express');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var notebookModel = mongoose.model('Notebook');
var noteModel = mongoose.model('Note');

// api
var router = express.Router();
// middleware to avoid router from stopping halfway
router.use(function(req, res, next) {
    next();
});
router.route('/')
    .get(function(req, res) {
        // query: /api/objects/?property=textValue&propertyarray=textValue0&propertyarray=textValue1
        var query = req.query;
        var idUser = req.cookies.idUser;
        var options;
        var queries = {};
        Object.keys(query).forEach((elk, ik, ak) => {
            if (Array.isArray(query[elk])) {
                // TODO: handle non string fields here, Boolean/Date also passed the test
                queries[elk] = { '$in': query[elk] };
            } else {
                // TODO: handle non string fields here, Boolean/Date also passed the test
                queries[elk] = query[elk];
            }
        });
        if (_.isNil(idUser)) {
            options = {
                '$and': [
                    queries,
                    { isPrivate: false }
                ]
            };
        } else {
            options = {
                '$and': [
                    queries,
                    { '$or': [{ isPrivate: false }, { creator: idUser }, { editor: idUser }] }
                ]
            };
        }
        noteModel.find(options).exec((err, notes) => {
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(notes);
            }
        });
    })
    .post(function(req, res) {
        var body = req.body;
        var idUser = req.cookies.idUser;
        if (_.isNil(idUser)) {
            res.status(400);
            res.json({ message: "Creating notes without user id is not allowed. Cookie idUser is missing." });
        } else if (_.isNil(body.idNotebook)) {
            res.status(400);
            res.json({ message: "Creating notes without notebook id is not allowed." });
        } else {
            // TODO: maintenance any note not refered by any notebook should be removed.
            async.waterfall([
                (callback) => {
                    notebookModel.findById(body.idNotebook).exec((err, notebook) => {
                        if (err || _.isNil(notebook)) {
                            callback(err || { message: "Invalid notebook id" });
                        } else {
                            callback(null);
                        }
                    });
                },
                (callback) => {
                    var note = body.data;
                    if (_.isNil(note)) {
                        note = {};
                    }
                    note.creator = idUser;
                    note.editor = idUser;
                    noteModel.create(note, (err, note) => {
                        callback(err, note);
                    });
                },
                (note, callback) => {
                    notebookModel.findByIdAndUpdate(body.idNotebook, { '$push': { notes: note._id } }).exec((err, raw) => {
                        callback(err, note);
                    });
                }
            ], (err, note) => {
                if (err) {
                    res.status(400);
                    res.json(err);
                } else {
                    res.status(201);
                    res.json(note);
                }
            });
        }
    })
    .put(function(req, res) {
        res.status(405);
        res.json();
    })
    .delete(function(req, res) {
        res.status(405);
        res.json();
    });
router.route('/:idNote')
    .get(function(req, res) {
        var idNote = req.params.idNote;
        noteModel.findById(idNote).exec((err, note) => {
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(note);
            }
        });
    })
    .post(function(req, res) {
        res.status(405);
        res.json();
    })
    .put(function(req, res) {
        var idNote = req.params.idNote;
        var body = req.body;
        var idUser = req.cookies.idUser;
        if (_.isNil(idUser)) {
            res.status(400);
            res.json({ message: "Updating notes without user id is not allowed. Cookie idUser is missing." });
        } else if (_.isNil(body.update)) {
            res.status(400);
            res.json({ message: "Update information is missing." });
        } else {
            var update = body.update;
            update.editor = idUser;
            update.dtEdited = Date.now();
            noteModel.findByIdAndUpdate(idNote, body.update, _.isNil(body.options) ? {} : body.options).exec((err, raw) => {
                if (err) {
                    res.status(400);
                    res.json(err);
                } else {
                    res.status(204);
                    res.json();
                }
            });
        }
    })
    .delete(function(req, res) {
        res.status(405);
        res.json({ message: "Please use DELETE /api/notebooks/:idNotebook/notes/:idNote." });
    });
module.exports = router;