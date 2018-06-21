var express = require('express');
var _ = require('lodash');
var mongoose = require('mongoose');

var userModel = mongoose.model('User');

var router_users = require('./apis/users.js');
var router_notebooks = require('./apis/notebooks.js');
var router_notes = require('./apis/notes.js');
var router_problems = require('./apis/problems.js');
var router_solutions = require('./apis/solutions.js');

// api
var router = express.Router();
// middleware to avoid router from stopping halfway
router.use(function(req, res, next) {
  next();
});
router.get('/',
  function(req, res) {
    res.json({
      message: "hello, RESTful!"
    });
  });
// functions
router.route('/signin')
  .get(function(req, res) {
    res.status(405);
    res.json();
  })
  .post(function(req, res) {
    var body = req.body;
    userModel.findById(body._id).populate({ path: 'notebook' }).populate({ path: 'problems', populate: { path: 'problem' } }).exec((err, user) => {
      if (err) {
        res.status(400);
        res.json(err);
      } else if (_.isNil(user)) {
        res.status(401);
        res.json({
          code: "Bad Request",
          message: "Username is not found."
        });
      } else if (body.password !== user.password) {
        res.status(401);
        res.json({
          code: "Unauthorized",
          message: "Username and password does not match"
        });
      } else {
        res.status(200);
        let user_secure = JSON.parse(JSON.stringify(user));
        delete user_secure.password;
        res.cookie('idUser', user_secure._id);
        res.json(user_secure);
      }
    });
  })
  .put(function(req, res) {
    res.status(405);
    res.json();
  })
  .delete(function(req, res) {
    res.status(405);
    res.json();
  });
router.route('/signup')
  .get(function(req, res) {
    res.status(405);
    res.json();
  })
  .post(function(req, res) {
    var body = req.body;
    userModel.create(body, (err, user) => {
      if (err) {
        res.status(400);
        res.json(err);
      } else {
        let user_secure = JSON.parse(JSON.stringify(user));
        delete user_secure.password;
        res.status(201);
        res.cookie('idUser', user_secure._id);
        res.json(user_secure);
      }
    });
  })
  .put(function(req, res) {
    res.status(405);
    res.json();
  })
  .delete(function(req, res) {
    res.status(405);
    res.json();
  });
router.use('/users', router_users);
router.use('/notebooks', router_notebooks);
router.use('/notes', router_notes);
router.use('/problems', router_problems);
router.use('/solutions', router_solutions);

module.exports = router;