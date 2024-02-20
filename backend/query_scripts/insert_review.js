const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

async function hehe(){
    const temp1 = await readFileAsync('../data/anime_review.json');
    const anime_reviews = JSON.parse(temp1);
    for(let i = 0; i < anime_reviews.length; i++){
        await pool.query(
            `
            INSERT INTO anime_review (user_id, anime_id, rating, body, date_posted)
            VALUES ($1, $2, $3, $4, $5)
            `, [anime_reviews[i].user_id, anime_reviews[i].anime_id, anime_reviews[i].rating, anime_reviews[i].body, anime_reviews[i].date_posted]
        );
    }

    const temp2 = await readFileAsync('../data/character_review.json');
    const character_reviews = JSON.parse(temp2);
    for(let i = 0; i < character_reviews.length; i++){
        await pool.query(
            `
            INSERT INTO character_review (user_id, character_id, rating, body, date_posted)
            VALUES ($1, $2, $3, $4, $5)
            `, [character_reviews[i].user_id, character_reviews[i].character_id, character_reviews[i].rating, character_reviews[i].body, character_reviews[i].date_posted]
        );
    }
}

hehe();