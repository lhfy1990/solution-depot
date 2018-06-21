var express = require('express');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var problemModel = mongoose.model('Problem');
var solutionModel = mongoose.model('Solution');

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
        solutionModel.find(options).exec((err, notes) => {
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
            res.json({ message: "Creating solutions without user id is not allowed. Cookie idUser is missing." });
        } else if (_.isNil(body.idProblem)) {
            res.status(400);
            res.json({ message: "Creating solutions without problem id is not allowed." });
        } else {
            // TODO: maintenance any solution not refered by any problem should be removed.
            async.waterfall([
                (callback) => {
                    problemModel.findById(body.idProblem).exec((err, problem) => {
                        if (err || _.isNil(problem)) {
                            callback(err || { message: "Invalid problem id" });
                        } else {
                            callback(null);
                        }
                    });
                },
                (callback) => {
                    var data = body.data;
                    if (_.isNil(data)) {
                        data = {};
                    }
                    data.creator = idUser;
                    data.editor = idUser;
                    console.log(data);
                    solutionModel.create(data, (err, solution) => {
                        callback(err, solution);
                    });
                },
                (solution, callback) => {
                    problemModel.findByIdAndUpdate(body.idProblem, { '$push': { solutions: solution._id } }).exec((err, raw) => {
                        callback(err, solution);
                    });
                }
            ], (err, solution) => {
                if (err) {
                    res.status(400);
                    res.json(err);
                } else {
                    res.status(201);
                    res.json(solution);
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
router.route('/:idSolution')
    .get(function(req, res) {
        var idSolution = req.params.idSolution;
        solutionModel.findById(idSolution).exec((err, solution) => {
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(solution);
            }
        });
    })
    .post(function(req, res) {
        res.status(405);
        res.json();
    })
    .put(function(req, res) {
        var idSolution = req.params.idSolution;
        var body = req.body;
        var idUser = req.cookies.idUser;
        if (_.isNil(idUser)) {
            res.status(400);
            res.json({ message: "Updating solutions without user id is not allowed. Cookie idUser is missing." });
        } else if (_.isNil(body.update)) {
            res.status(400);
            res.json({ message: "Update information is missing." });
        } else {
            var update = body.update;
            update.editor = idUser;
            update.dtEdited = Date.now();
            solutionModel.findByIdAndUpdate(idSolution, body.update, _.isNil(body.options) ? {} : body.options).exec((err, raw) => {
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
        res.json({ message: "Please use DELETE /api/problems/:idProblem/solutions/:idSolution." });
    });
module.exports = router;