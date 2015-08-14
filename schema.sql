CREATE TABLE topics (
    id integer PRIMARY KEY AUTOINCREMENT,
    title text NOT NULL,
    username varchar(255) NOT NULL,
    post_date DATE DEFAULT CURRENT_DATE,
    hi_fives integer
);

CREATE TABLE comments (
    id integer PRIMARY KEY AUTOINCREMENT,
    topic_id integer,
    comment text NOT NULL,
    username varchar(255) NOT NULL,
    comment_date DATE DEFAULT CURRENT_DATE
);


--SELECT * FROM topics INNER JOIN comments ON topics.id = comments.topic_id WHERE comments.topic_id='3'

--SELECT count(comment) FROM comments WHERE topic_id=2;

SELECT count(comment) FROM comments INNER JOIN topics ON comments.topic_id = topics.id WHERE comments.topic_id='1'

SELECT count(comments.id), topics.title FROM comments INNER JOIN topics ON comments.topic_id = topics.id;

SELECT count(comment), topics.title, topics.username, topics.post_date, topics.hi_fives FROM comments INNER JOIN topics ON comments.topic_id = topics.id WHERE comments.topic_id='1';

