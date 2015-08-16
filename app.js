//Dependencies
var express = require('express');
var app = express();
var fs = require('fs');
var ejs = require('ejs');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('forum.db');
app.use(express.static('public'));
var request = require('request');


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
    //Read in index.html file
    //When a user clicks Create New Topic Button, a modal pops up which
    //they can enter their username and a topic title.
    
    db.all('SELECT * FROM topics ORDER BY hi_fives DESC', function(err, rows){
         //As new topics are created, they will be shown on the main index page.
         //Loop through rows in ejs template and output, sort the cards by Hi-Five count highest to lowest
        if (err){
            console.log(err);

        } else {
            
            var dbData = rows;
            var rendered = ejs.render(html, {dbData: dbData});
            res.send(rendered);
        }                       
    });     
});

app.get('/topics/:id', function(req, res){
    // When a user clicks on a topic card, they are taken to show.html view
    // which displays the topic at the top, date created, location comments, and a field for comments to be added to the topic
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

});

app.post('/topics', function(req, res){
    //Uses Telize API to get location info on post and adds city and state to database
    request.get('http://www.telize.com/geoip', function(error, response, body){
    var locationData = JSON.parse(body);
    var city = locationData.city;
    var state = locationData.region_code;
    var userLocation = city + ", " + state;
    //console.log(userLocation);

    var title = req.body.title;
    var username = req.body.username;
    //When they click CARD IT button, INSERT the user info into the Topics database table
        db.run('INSERT INTO topics (title, username, hi_fives, comment_count, user_location) VALUES (?, ?, ?, ?, ?)', title, username, 0, 0, userLocation, function(err){
            if (err){
                console.log(err);

            } else {
                res.redirect('/');
            }
        });
    });
});

app.post('/comments', function(req, res){
    //When a user wants to add a comment(Chatter), they fill in username and click the Submit Chatter Button.  
    //Uses Telize API to get location info on post and adds city and state to database.
    request.get('http://www.telize.com/geoip', function(error, response, body){
    var locationData = JSON.parse(body);
    var city = locationData.city;
    var state = locationData.region_code;
    var userLocation = city + ", " + state;
    //console.log(userLocation);

    var avatars = [ 'http://orig13.deviantart.net/b28b/f/2011/156/9/d/pikachu_avatar_or_icon_by_pheonixmaster1-d3i6as0.png', 'https://v.cdn.vine.co/r/avatars/FADE099E3B1185834932417728512_363338cac24.1.5.jpg?versionId=b3iMnUE8Q_wM7TXH2Vad89xvPKhcWxSX', 'http://www.outerheavenforums.com/customavatars/avatar2533_22.gif', 'http://static.tumblr.com/ntl1ymx/uexmc1yck/ss-avatar1.png', 'http://0.gravatar.com/blavatar/21c9c075edae691ac485eed243eb1709?s=200', 'http://0.gravatar.com/avatar/89dbdde5e9d339596a4b2f4e866508f6?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=PG', 'https://2.gravatar.com/avatar/52a035e19fce4834c7d8a8dba78edb96?s=200&d=http%3A%2F%2Fs1.wp.com%2Fi%2Flogo%2Fwhite-gray-80.png&r=G', 'http://1.gravatar.com/avatar/541d9e261b493dcf976714a53e4668ab?s=200&d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G', 'http://0.gravatar.com/avatar/c8fa1abc6a88daf04e26ed3fdb6041ef?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=PG', 'http://1.gravatar.com/avatar/3dd15654f9190f6302680659d6f5d8b2?s=200&d=http%3A%2F%2F1.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G', 'http://0.gravatar.com/avatar/fc7e09e3fda5812c326a4b1cfbdf945c?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G', 'http://logopond.com/avatar/33925/gorillablu_avatar200x200_low.jpg', 'https://forums.tibiawindbot.com/image.php?u=17482&dateline=1401028751', 'http://static.planetminecraft.com/files/avatar/878766.png', 'http://cdn.cakecentral.com/avatars/d/d7/909930_wisebaker_6JtT_200x200.jpg' ];

    //An Avatar image is randomly assigned from an array of image URLs to the user, which is added to the comment database
    var userAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    //console.log(userAvatar); 

       var topic_id = req.body.topic_id;
       var username = req.body.username;
       var comment = req.body.comment;

       db.run('INSERT INTO comments (topic_id, username, comment, user_location, user_avatar) VALUES (?, ?, ?, ?, ?)', topic_id, username, comment, userLocation, userAvatar, function(err){
            if (err){
                console.log(err);

            } else {
                var topicId = req.body.topic_id;

                //The current comment count is selected from the database and incremented up by 1 each time a new comment is added and the record is updated in the database.
                db.get('SELECT comment_count FROM topics WHERE id=?', topic_id, function(err, row){
                    if (err){
                        console.log(err);

                    } else {
                        var currentCommentCount = row.comment_count;
                        //console.log(currentCommentCount);

                        var updatedCount = currentCommentCount + 1;
                        //console.log(updatedCount);

                        db.run('UPDATE topics SET comment_count=? WHERE id=?', updatedCount, topic_id, function(err){
                            if (err){
                                console.log(err);
                            } else {
                                res.redirect('/topics/'+topicId);
                            }
                        });      
                    }
                });
            }
       });

  });
});

//This is the counter for updating Hi-Five count, which grabs the current Hi-Five count for the current topic from the database and increments the count up by 1 and the record is updated in the database.
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





