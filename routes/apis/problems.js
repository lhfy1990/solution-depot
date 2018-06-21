var express = require('express');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
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
        options = queries;
        problemModel.find(options).exec((err, problem) => {
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(problem);
            }
        });
    })
    .post(function(req, res) {
        var body = req.body;
        var idUser = req.cookies.idUser;
        if (_.isNil(idUser)) {
            res.status(400);
            res.json({ message: "Posting problem without user id is not allowed. Cookie idUser is missing." });
        } else {
            body.creator = idUser;
            body.editor = idUser;
            problemModel.create(body, (err, problem) => {
                if (err) {
                    res.status(400);
                    res.json(err);
                } else {
                    res.status(201);
                    res.json(problem);
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
router.route('/:idProblem')
    .get(function(req, res) {
        var idProblem = req.params.idProblem;
        problemModel.findById(idProblem).populate({ path: 'solutions' }).exec((err, problem) => {
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(problem);
            }
        });
    })
    .post(function(req, res) {
        res.status(405);
        res.json();
    })
    .put(function(req, res) {
        var idProblem = req.params.idProblem;
        var idUser = req.cookies.idUser;
        var body = req.body;
        if (_.isNil(body.update)) {
            res.status(400);
            res.json({ message: "Update information is missing." });
        } else {
            var update = body.update;
            update.editor = idUser;
            update.dtEdited = Date.now();
            problemModel.findByIdAndUpdate(idProblem, body.update, _.isNil(body.options) ? {} : body.options).exec((err, raw) => {
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
router.route('/:idProblem/solutions/:idSolution')
    .get(function(req, res) {
        res.status(405);
        res.json({ message: "Please use GET /api/solutions/:idSolution." });
    })
    .post(function(req, res) {
        res.status(405);
        res.json();
    })
    .put(function(req, res) {
        res.status(405);
        res.json({ message: "Please use PUT /api/solutions/:idSolution." });
    })
    .delete(function(req, res) {
        var idProblem = req.params.idProblem;
        var idSolution = req.params.idSolution;
        // TODO: maintenance any problem.solutions id without any matching in solutions collection should be pulled.
        async.waterfall([
            (callback) => {
                problemModel.findByIdAndUpdate(idProblem, { $pull: { solutions: idSolution } }).exec((err, raw) => {
                    callback(err);
                });
            },
            (callback) => {
                solutionModel.findByIdAndDelete(idSolution).exec((err, solution) => {
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