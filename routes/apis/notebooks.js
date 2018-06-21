var express = require('express');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
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
        res.status(405);
        res.json();
    })
    .post(function(req, res) {
        var body = req.body;
        var idUser = req.cookies.idUser;
        if (_.isNil(idUser)) {
            res.status(400);
            res.json({ message: "Creating notebook without user id is not allowed. Cookie idUser is missing." });
        } else {
            // TODO: maintenance any notebook not refered by any user should be removed.
            async.waterfall([
                (callback) => {
                    userModel.findById(idUser).populate({ path: 'notebook' }).exec((err, user) => {
                        if (err || _.isNil(user)) {
                            callback(err || { message: "Invalid user id." });
                        } else if (_.isNil(user.notebook)) {
                            callback(null);
                        } else {
                            callback({ message: "The user has a notebook. There is no need to create new." });
                        }
                    });
                },
                (callback) => {
                    notebookModel.create(body, (err, notebook) => {
                        callback(err, notebook);
                    });
                },
                (notebook, callback) => {
                    userModel.findByIdAndUpdate(idUser, { '$set': { notebook: notebook._id } }).exec((err, raw) => {
                        callback(err, notebook);
                    });
                }
            ], (err, notebook) => {
                if (err) {
                    res.status(400);
                    res.json(err);
                } else {
                    res.status(201);
                    res.json(notebook);
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
router.route('/:idNotebook')
    .get(function(req, res) {
        var idNotebook = req.params.idNotebook;
        notebookModel.findById(idNotebook).populate({ path: 'notes' }).exec((err, notebook) => {
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(notebook);
            }
        });
    })
    .post(function(req, res) {
        res.status(405);
        res.json();
    })
    .put(function(req, res) {
        var idNotebook = req.params.idNotebook;
        var body = req.body;
        if (_.isNil(body.update)) {
            res.status(400);
            res.json({ message: "Update information is missing." });
        } else {
            notebookModel.findByIdAndUpdate(idNotebook, body.update, _.isNil(body.options) ? {} : body.options).exec((err, raw) => {
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
        res.json();
    });
router.route('/:idNotebook/notes/:idNote')
    .get(function(req, res) {
        res.status(405);
        res.json({ message: "Please use GET /api/notes/:idNote." });
    })
    .post(function(req, res) {
        res.status(405);
        res.json();
    })
    .put(function(req, res) {
        res.status(405);
        res.json({ message: "Please use PUT /api/notes/:idNote." });
    })
    .delete(function(req, res) {
        var idNotebook = req.params.idNotebook;
        var idNote = req.params.idNote;
        // TODO: maintenance any notebook.notes id without any matching in notes collection should be pulled.
        async.waterfall([
            (callback) => {
                notebookModel.findByIdAndUpdate(idNotebook, { $pull: { notes: idNote } }).exec((err, raw) => {
                    callback(err);
                });
            },
            (callback) => {
                noteModel.findByIdAndDelete(idNote).exec((err, note) => {
                    callback(err);
                });
            }
        ], (err) => {
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(204);
                res.json();
            }
        });
    });
module.exports = router;