const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

async function hehe(){
    const temp1 = await readFileAsync('../data/forum_post.json');
    const posts = JSON.parse(temp1);
    for(let i = 0; i < posts.length; i++){
        await pool.query(
            `
            INSERT INTO forum_post (anime_id, character_id, user_id, title, body, date_posted, topic)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [posts[i].anime_id, posts[i].character_id, posts[i].user_id, posts[i].title, posts[i].body, posts[i].date_posted, posts[i].topic]
        );
    }

    const temp2 = await readFileAsync('../data/forum_post_votes.json');
    const votes = JSON.parse(temp2);
    for(let i = 0; i < votes.length; i++){
        await pool.query(
            `
            INSERT INTO forum_post_vote (post_id, user_id, upvote) VALUES ($1, $2, $3)
            `, [votes[i].post_id, votes[i].user_id, votes[i].upvote]
        );
    }

    const temp3 = await readFileAsync('../data/forum_comment.json');
    const comments = JSON.parse(temp3);
    for(let i = 0; i < comments.length; i++){
        await pool.query(
            `
            INSERT INTO forum_comment (post_id, user_id, body, date_commented) VALUES ($1, $2, $3, $4)
            `, [comments[i].post_id, comments[i].user_id, comments[i].body, comments[i].date_commented]
        );
    }
}

hehe();