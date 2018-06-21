var express = require('express');
var _ = require('lodash');
var mongoose = require('mongoose');
var userModel = mongoose.model('User');

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
        res.status(405);
        res.json();
    })
    .put(function(req, res) {
        res.status(405);
        res.json();
    })
    .delete(function(req, res) {
        res.status(405);
        res.json();
    });
router.route('/:idUser')
    .get(function(req, res) {
        var idUser = req.params.idUser;
        userModel.findById(idUser).populate({ path: 'notebook' }).populate({ path: 'problems', populate: { path: 'problem' } }).exec((err, user) => {
            if (err) {
                res.status(400);
                res.json(err);
            } else {
                res.status(200);
                res.json(user);
            }
        });
    })
    .post(function(req, res) {
        res.status(405);
        res.json();
    })
    .put(function(req, res) {
        var idUser = req.params.idUser;
        var cookieUser = req.cookies.idUser;
        var body = req.body;
        if (_.isNil(cookieUser) || idUser !== cookieUser) {
            res.status(400);
            res.json({ message: "User can only be updated by himself/herself." });
        } else if (_.isNil(body.update)) {
            res.status(400);
            res.json({ message: "Update information is missing." });
        } else {
            userModel.findByIdAndUpdate(idUser, body.update, _.isNil(body.options) ? {} : body.options).exec((err, raw) => {
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
module.exports = router;