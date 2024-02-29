const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function hehe(){
    try {
        
        const temp = await readFileAsync('../data/user_data.json');
        const userlist = JSON.parse(temp);

        const studiolist = await pool.query(
            `
            SELECT * FROM studio
            `
        );

        const temp2 = await readFileAsync('../data/forum_post_data.json');
        const list = JSON.parse(temp2);

        const dates = list.map(it => it.date_posted);

        for(let i = 0; i < studiolist.rows.length; i++){
            let limit = randomNumber(0, 949);
            for(let j = limit; j < limit + 50; j++){
                await pool.query(
                    `
                    INSERT INTO follow (user_id, studio_id, date_followed) VALUES ($1, $2, $3)
                    `, [j+1, studiolist.rows[i].id, dates[randomNumber(0, 499)]]
                )
            }
        }

    } catch (error) {
        console.log(error);
    }
}

hehe();