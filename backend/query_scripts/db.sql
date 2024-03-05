CREATE DATABASE anime_test;

CREATE SEQUENCE anime_id_seq START 14000;
CREATE TABLE anime(
    id INTEGER DEFAULT nextval('anime_id_seq') PRIMARY KEY,
    romaji_title VARCHAR(200),
    english_title VARCHAR(200),
    description VARCHAR(3000),
    status VARCHAR(15),
    season VARCHAR(20),
    episodes INTEGER,
    duration INTEGER,
    start_date DATE,
    end_date DATE,
    imagelink VARCHAR(1000),
    bannerlink VARCHAR(1000),
    visibility INTEGER
);

CREATE SEQUENCE manga_id_seq START 172000;
CREATE TABLE manga(
    id INTEGER DEFAULT nextval('manga_id_seq') PRIMARY KEY,
    romaji_title VARCHAR(200),
    english_title VARCHAR(200),
    description VARCHAR(3000),
    status VARCHAR(15),
    volumes INTEGER,
    chapters INTEGER,
    start_date DATE,
    end_date DATE,
    imagelink VARCHAR(1000),
    bannerlink VARCHAR(1000)
);

CREATE SEQUENCE character_id_seq START 330000;
CREATE TABLE "character"(
    id INTEGER DEFAULT nextval('character_id_seq') PRIMARY KEY,
    name VARCHAR(80),
    gender VARCHAR(30),
    description VARCHAR(10000),
    imagelink VARCHAR(1000)
);

CREATE SEQUENCE studio_id_seq START 7500;
CREATE TABLE studio(
    id INTEGER DEFAULT nextval('studio_id_seq') PRIMARY KEY,
    name VARCHAR(50),
    refund_time_limit INTERVAL DEFAULT '3 day',
    refund_rate DOUBLE PRECISION DEFAULT 0.5
);

CREATE SEQUENCE user_id_seq START 1001;
CREATE TABLE "user"(
    id INTEGER DEFAULT nextval('user_id_seq') PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    gender VARCHAR(15),
    joined DATE DEFAULT CURRENT_DATE,
    avatarlink VARCHAR(500),
    password VARCHAR(100)
);

CREATE TABLE forum_post(
    id SERIAL PRIMARY KEY,
    anime_id INTEGER REFERENCES anime(id),
    character_id INTEGER REFERENCES "character"(id),
    user_id INTEGER REFERENCES "user"(id),
    title VARCHAR(1000),
    body VARCHAR(100000),
    date_posted DATE DEFAULT CURRENT_DATE,
    topic VARCHAR(20)
);

CREATE TABLE forum_post_vote(
    post_id INTEGER REFERENCES forum_post(id),
    user_id INTEGER REFERENCES "user"(id),
    upvote BOOLEAN,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE forum_comment(
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES forum_post(id),
    user_id INTEGER REFERENCES "user"(id),
    body VARCHAR(2000),
    date_commented DATE DEFAULT CURRENT_DATE
);

CREATE TABLE anime_review(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    anime_id INTEGER REFERENCES anime(id),
    rating DOUBLE PRECISION,
    body VARCHAR(5000),
    date_posted DATE DEFAULT CURRENT_DATE
);

CREATE TABLE character_review(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    character_id INTEGER REFERENCES "character"(id),
    rating DOUBLE PRECISION,
    body VARCHAR(5000),
    date_posted DATE DEFAULT CURRENT_DATE
);

CREATE TABLE season(
    id SERIAL PRIMARY KEY,
    season_number INTEGER
);

CREATE TABLE episode(
    id SERIAL PRIMARY KEY,
    season_id INTEGER REFERENCES season(id),
    episode_number INTEGER,
    link VARCHAR(1000)
);

CREATE TABLE episode_comment(
    id SERIAL PRIMARY KEY,
    episode_id INTEGER REFERENCES episode(id),
    body VARCHAR(2000),
    date_commented DATE DEFAULT CURRENT_DATE
);

CREATE TABLE follow(
    user_id INTEGER REFERENCES "user"(id),
    studio_id INTEGER REFERENCES studio(id),
    date_followed DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (user_id, studio_id)
);

CREATE TABLE anime_manga(
    anime_id INTEGER REFERENCES anime(id),
    manga_id INTEGER REFERENCES manga(id),
    PRIMARY KEY (anime_id, manga_id)
);

CREATE TABLE anime_character(
    anime_id INTEGER REFERENCES anime(id),
    character_id INTEGER REFERENCES "character"(id),
    PRIMARY KEY (anime_id, character_id)
);

CREATE TABLE anime_studio(
    anime_id INTEGER REFERENCES anime(id),
    studio_id INTEGER REFERENCES studio(id),
    price INTEGER,
    season_id INTEGER REFERENCES season(id),
    PRIMARY KEY (anime_id, studio_id)
);

CREATE TABLE anime_genre(
    anime_id INTEGER REFERENCES anime(id),
    genre VARCHAR(20),
    PRIMARY KEY (anime_id, genre)
);

CREATE TABLE purchase(
    user_id INTEGER REFERENCES "user"(id),
    anime_id INTEGER REFERENCES anime(id),
    watched BOOLEAN,
    timestamp_purchased TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, anime_id)
);

CREATE TABLE bookmarks(
    user_id INTEGER REFERENCES "user"(id),
    anime_id INTEGER REFERENCES anime(id),
    PRIMARY KEY (user_id, anime_id)
);

DROP TABLE anime_genre;
DROP TABLE anime_manga;
DROP TABLE anime_studio;
DROP TABLE anime_character;
DROP TABLE purchase;
DROP TABLE bookmarks;



SELECT FP.id, FP.anime_id, FP.title, A.romaji_title, FP.user_id, U.first_name, FP.date_posted
FROM forum_post FP
JOIN anime A ON A.id = FP.anime_id
JOIN "user" U ON U.id = FP.user_id;
UNION 
SELECT FP.id, FP.anime_id, FP.character_id, FP.title, C.name
FROM forum_post FP
JOIN "character" C ON C.id = FP.character_id;

-- A way to sort by popularity without using visibility
SELECT A.id, A.romaji_title, A.english_title, A.imagelink, COALESCE(T.count, 0) AS user_count
FROM anime_studio SA JOIN anime A ON A.id = SA.anime_id
LEFT JOIN 
(
	SELECT anime_id, COUNT(user_id)
	FROM purchase P
	GROUP BY P.anime_id
) T ON T.anime_id = SA.anime_id
WHERE SA.studio_id = 11
ORDER BY COALESCE(T.count, 0) DESC;

-- Basically, just join the sub-query, then you have the popularity parameter to order by
SELECT A.*, COALESCE(T.COUNT, 0) AS popularity
FROM anime A
LEFT JOIN (
SELECT anime_id, COUNT(user_id)
FROM purchase P
GROUP BY P.anime_id
) T ON T.anime_id = A.id
ORDER BY popularity DESC;


ALTER TABLE "user" ADD "password" VARCHAR(100);
UPDATE "user" SET "password" = '1234';

ALTER TABLE "user"
ALTER COLUMN joined SET DEFAULT CURRENT_DATE;

ALTER TABLE anime_studio ADD season_id INTEGER REFERENCES season(id);

ALTER TABLE purchase ADD timestamp_purchased TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
UPDATE purchase
SET timestamp_purchased = 
    CURRENT_TIMESTAMP - 
    (random() * (interval '365 days'))::interval;


ALTER TABLE anime_review ALTER COLUMN date_purchased SET DEFAULT CURRENT_DATE;
ALTER TABLE character_review ALTER COLUMN date_purchased SET DEFAULT CURRENT_DATE;

ALTER TABLE studio ADD refund_time_limit INTERVAL DEFAULT '3 day';
ALTER TABLE studio ADD refund_rate DOUBLE PRECISION DEFAULT 0.5;

ALTER TABLE "user" ADD balance DOUBLE PRECISION DEFAULT 0;


