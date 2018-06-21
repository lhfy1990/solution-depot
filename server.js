// requires
var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var app = express();
var mongoose = require('mongoose');

// configs
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
var port = process.env.PORT || 8080;

// mongoose.set('debug', true);
var mongodb = 'mongodb://localhost/solution-depot';
// var mongodb = 'mongodb://user:pass@mongodb/app';
mongoose.connect(mongodb, { autoIndex: false });
var db = mongoose.connection;
var noteModel = require('./models/note.js')(db);
var notebookModel = require('./models/notebook.js')(db);
var solutionModel = require('./models/solution.js')(db);
var problemModel = require('./models/problem.js')(db);
var userModel = require('./models/user.js')(db);

// execution
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    noteModel.ensureIndexes();
    notebookModel.ensureIndexes();
    solutionModel.ensureIndexes();
    problemModel.ensureIndexes();
    userModel.ensureIndexes();
    console.log(`${mongodb} connect`);
    // route
    // static
    app.use('', express.static(path.join(__dirname, 'public')));
    // api
    router_api = require('./routes/api.js');
    app.use('/api', router_api);

    // execute
    http.createServer(app).listen(port);
    console.log(`Server running on port: ${port}`);
});
