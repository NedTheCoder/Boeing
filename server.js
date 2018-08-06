// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================
    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    notesList = [];

// routes ======================================================================

    // get all notes
    app.get('/api/notes', function(req, res) {
        res.json(notesList);
    });

    // create a new note and send back updated notes
    app.post('/api/notes', function(req, res) {
        notesList.push({
             title: req.body.title,
             content: req.body.content,
             done: false
        });
        res.json(notesList);
    });

    // delete a note and send back updated notes
    app.delete('/api/notes/:noteTitle', function(req, res) {
        notesList =  notesList.filter( el => el.title !== req.params.noteTitle);
        res.json(notesList);
    });

    // update a note and send back updated notes
    app.post('/api/notes/:note', function(req, res) {
        temp = JSON.parse(req.params.note);
        for(var i in notesList) {
            if(notesList[i].title == temp.title) {
                notesList[i].content = temp.content;
                break;
            }
        }
        res.json(notesList);
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the spa
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");

