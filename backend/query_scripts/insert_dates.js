const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function hehe(){
    try {
        
        const temp = await readFileAsync('../data/forum_post_data.json');
        const list = JSON.parse(temp);

        const dates = list.map(it => it.date_posted);

        //console.log(dates);

        const purchase_list = await pool.query(
            `
            SELECT * FROM purchase
            `
        );

        for(let i = 0; i < purchase_list.rows.length; i++){
            await pool.query(
                `
                UPDATE purchase SET date_purchased = $1 
                WHERE user_id = $2 AND anime_id = $3
                `, [dates[randomNumber(0, 499)], purchase_list.rows[i].user_id, purchase_list.rows[i].anime_id]
            );
        }

    } catch (error) {
        console.log(error);
    }
}

hehe();