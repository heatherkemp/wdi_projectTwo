//Dependencies
var express = require('express');
var app = express();
var fs = require('fs');
var ejs = require('ejs');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('forum.db');
app.use(express.static('public'));


//Middleware
var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedBodyParser);
var methodOverride = require('method-override');
app.use(methodOverride('_method'));


//Config
app.listen(3000, function(){
    console.log('Server is listening!');
})

app.get('/', function(req, res){
    var html = fs.readFileSync('./views/index.html', 'utf8');
    //When a user clicks Create New Topic Button, a modal pops up which
    //they can enter their username and a topic title.

    db.all('SELECT * FROM topics', function(err, rows){
        if (err){
            console.log(err);

        } else {
            //console.log(rows);
            var dbData = rows;
            //As new topics are created, they will be shown on the main index page.
            //Loop through rows in ejs template and output
            var rendered = ejs.render(html, {dbData: dbData});
            res.send(rendered);
            //Sort the cards by Hi-Five count highest to lowest
            //may need to join topics table and comments table to get Hi-Five count
        }
    });
    
});

app.get('/topics/:id', function(req, res){
    // When a user clicks on a topic card, they are taken to show.html view
    // which displays the topic at the top, date created, comments, and a field for comments to 
    // be added to the topic
    var html = fs.readFileSync('./views/show.html', 'utf8');
    var id = req.params.id;

    db.get('SELECT * FROM topics WHERE id=?', id, function(err, row){
        if (err){
            console.log(err);

        } else {
            var dbData = row;
        
            var rendered = ejs.render(html, dbData);
            res.send(rendered);
        }
    });
});

app.post('/topics', function(req, res){
    var title = req.body.title;
    var username = req.body.username;
    //When they click CARD IT button, INSERT the user info into the Topics database table
    db.run('INSERT INTO topics (title, username) VALUES (?, ?)', title, username, function(err){
        if (err){
            console.log(err);

        } else {
            res.redirect('/');
        }
    });
});








