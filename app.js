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
    
    db.all('SELECT * FROM topics ORDER BY hi_fives DESC', function(err, rows){
         //As new topics are created, they will be shown on the main index page.
         //Loop through rows in ejs template and output, sort the cards by Hi-Five count highest to lowest
        if (err){
            console.log(err);

        } else {
            
            var dbData = rows;
            //console.log(dbData);
            var newData = [];

            
                dbData.forEach(function(topic){
                    var id = topic.id;
                    
                        db.get('SELECT COUNT(comment),topics.title, topics.username, topics.post_date, topics.hi_fives FROM comments INNER JOIN topics ON comments.topic_id = topics.id WHERE comments.topic_id=?', id, function(err, row){
                            if (err){
                                console.log(err);

                            } else {
                                newData.push(row);
                                //console.log(newData);
                                
                                //adds a conditional to prevent rendered from running until the iteration is done.
                                if (newData.length === dbData.length){
                                var rendered = ejs.render(html, {newData: newData});
                                res.send(rendered);
                                }
                            }
                        });
                });       
            }                       
    });     
});

app.get('/topics/:id', function(req, res){
    // When a user clicks on a topic card, they are taken to show.html view
    // which displays the topic at the top, date created, comments, and a field for comments to 
    // be added to the topic
    var html = fs.readFileSync('./views/show.html', 'utf8');
    var id = req.params.id;
    //console.log(id);

    db.get('SELECT * FROM topics WHERE id=?', id, function(err, row){
        if (err){
            console.log(err);

        } else {
             var dbData = row;
             //console.log(row);

            db.all('SELECT * FROM comments WHERE topic_id=?', id, function(err, rows){
               
                var comments = rows;

                //console.log(comments);
                var rendered = ejs.render(html, {comments: comments, dbData: dbData});
                res.send(rendered);
            });            
        }
    });

    // db.all('SELECT * FROM topics INNER JOIN comments ON topics.id = comments.topic_id WHERE comments.topic_id=?', id, function(err, rows){
    //     if (err){
    //         console.log(err);

    //     } else {
    //         var dbData = rows;
    //         console.log(dbData);
            
    //         // var rendered = ejs.render(html, dbData);
    //         res.send(html);
    //     }
    // });
});

app.post('/topics', function(req, res){
    var title = req.body.title;
    var username = req.body.username;
    //When they click CARD IT button, INSERT the user info into the Topics database table
    db.run('INSERT INTO topics (title, username, hi_fives) VALUES (?, ?, ?)', title, username, 0, function(err){
        if (err){
            console.log(err);

        } else {
            res.redirect('/');
        }
    });
});

app.post('/comments', function(req, res){
   var topic_id = req.body.topic_id;
   var username = req.body.username;
   var comment = req.body.comment;

   db.run('INSERT INTO comments (topic_id, username, comment) VALUES (?, ?, ?)', topic_id, username, comment, function(err){
        if (err){
            console.log(err);

        } else {
            var topicId = req.body.topic_id;
            res.redirect('/topics/'+topicId);
        }
   });
});


app.put('/topics/:id/edit', function(req, res){
    var topic_id = req.params.id;
    db.get('SELECT hi_fives FROM topics WHERE id=?', topic_id, function(err, row){
        if (err){
            console.log(err);

        } else {
            var currentHiFiveCount = row.hi_fives;
            //console.log(currentHiFiveCount);

            var updatedCount = currentHiFiveCount + 1;
            //console.log(updatedCount);

            db.run('UPDATE topics SET hi_fives=? WHERE id=?', updatedCount, topic_id, function(err){
                if (err){
                    console.log(err);
                }
            });      
        }
    });
});





