# Node Express RESTful Example
An example FullStack RESTful Design using NodeJS and Express. Front-end takes Angular but not necessary.

## Initialization
1. Make sure you have node installed with npm.
2. Make sure you have bower installed.
  * If not, run `npm install -g bower` to install.
3. Run `npm install` under the repository folder
  * It will handle node modules and bower modules.
  * Read .bowerrc and package.json for detail.

## Files
* server.js: main server.

## API:
### General:
* /signin
    * /
        * GET: 405
        * POST: sign in
        * PUT: 405
        * DELETE: 405
* /signup
    * /
        * GET: 405
        * POST: sign up
        * PUT: 405
        * DELETE: 405
### RESTful:
* /users
    * /
        * GET: 405
        * POST: 405
        * PUT: 405
        * DELETE: 405
    * /:idUser
        * GET: 200/400
        * POST: 405
        * PUT: {body.update: required, body.options: optional} 204/400
        * DELETE: 405
* /notebooks
    * /
        * GET: 405
        * POST: {cookies.idUser: required} 201/400
        * PUT: 405
        * DELETE: 405
    * /:idNotebook
        * GET: 200/400
        * POST: 405
        * PUT: {body.update: required, body.options: optional} 204/400
        * DELETE: 405
    * /:idNotebook/notes/:idNote
        * GET: 405
        * POST: 405
        * PUT: 405
        * DELETE: 204/400
* /notes
    * /
        * GET: {cookies.idUser: optional} 200/400
        * POST: {cookies.idUser: required, body.idNotebook: required, body.data: optional} 201/400
        * PUT: 405
        * DELETE: 405
    * /:idNote
        * GET: 200/400
        * POST: 405
        * PUT: {cookies.idUser: required, body.update: required, body.options: optional} 204/400
        * DELETE: 405
* /problems
    * /
        * GET: 200/400
        * POST: {cookies.idUser: required} 201/400
        * PUT: 405
        * DELETE: 405
    * /:idProblem
        * GET: 200/400
        * POST: 405
        * PUT: {body.update: required, body.options: optional} 204/400
        * DELETE: 405
    * /:idProblem/solutions/:idSolution
        * GET: 405
        * POST: 405
        * PUT: 405
        * DELETE: 204/400
* /solutions
    * /
        * GET: {cookies.idUser: optional} 200/400
        * POST: {cookies.idUser: required, body.idProblem: required, body.data: optional} 201/400
        * PUT: 405
        * DELETE: 405
    * /:idSolution
        * GET: 200/400
        * POST: 405
        * PUT: {cookies.idUser: required, body.update: required, body.options: optional} 204/400
        * DELETE: 405

## References:
* [REST API Tutorial](http://www.restapitutorial.com/)
* [Using HTTP Methods for RESTful Services](http://www.restapitutorial.com/lessons/httpmethods.html)
* [REST API Quick Tips](http://www.restapitutorial.com/lessons/restquicktips.html)
* [Build a RESTful API Using Node and Express 4](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4)
* [Dynamically Loading Controllers and Views with AngularJS/$controllerProvider and RequireJS](https://weblogs.asp.net/dwahlin/dynamically-loading-controllers-and-views-with-angularjs-and-requirejs)
* [Mulit-Resolution Icon Converter](https://www.icoconverter.com/)