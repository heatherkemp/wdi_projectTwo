CREATE TABLE topics (
    id integer PRIMARY KEY AUTOINCREMENT,
    title text NOT NULL,
    username varchar(255) NOT NULL,
    post_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE comments (
    id integer PRIMARY KEY AUTOINCREMENT,
    topic_id integer,
    comment text NOT NULL,
    username varchar(255) NOT NULL,
    comment_date DATE DEFAULT CURRENT_DATE,
    hi_fives integer
);