const express = require('express');
const cors = require('cors')
const pool = require('./query_scripts/db_connection');

const app = express();
app.set('view engine', 'ejs');

let user_id = null;
let username = null;
let studio_id = null;
let studioname = null;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log('server choltese');
});

//User login
app.get('/', (req, res) => {
    //res.render('user_login');
    res.render('login');
    console.log('1 ' + user_id);
})

// Authorize user login
app.get('/auth/user', async(req, res)=>{
    try {
        
        const {email, password} = req.query;
        console.log(email, password);
        const is_valid = await pool.query(
            `
            SELECT is_valid_user($1, $2);
            `, [email, password]
        );
        console.log(is_valid.rows[0].is_valid_user);
        if(is_valid.rows[0].is_valid_user){
            const q = await pool.query(
                `
                SELECT id FROM "user" WHERE email = $1 AND password = $2
                `, [email, password]
            );
            user_id = q.rows[0].id;
            res.redirect('/all_anime');
        } else{
            res.redirect('/');
        }

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Authorize studio login
app.get('/auth/studio', async(req, res)=>{
    try {

        studio_id = req.query.studio_id;
        console.log(studio_id);
        const q = await pool.query(
            `
            SELECT * FROM studio WHERE id = $1;
            `, [studio_id]
        );
        console.log(q.rows);

        if(q.rows[0]){
            res.redirect('/studio/individual/' + studio_id);
        } else{
            res.redirect('/');
        }

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Get all anime list
app.get('/all_anime', async(req, res) => {
    if(user_id == null){
        user_id = req.query.user_id;
    }
    var animelist;
    
    try {
        const q1 = await pool.query(
            `
            SELECT * FROM anime ORDER BY visibility DESC
            `,[]
        );
        animelist = q1.rows;
    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    try {
        const q1 = await pool.query(
            `
            SELECT first_name || ' ' || last_name AS name FROM "user" WHERE id = $1
            `,[user_id]
        );
        username = q1.rows[0].name;
        console.log(user_id, username);

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    res.render('all_anime', {animelist: animelist, username: username});
})

//Display user purchase history
app.get('/user_info', async (req, res) => {
    var user;
    try {
        const q = await pool.query(
            `
            SELECT * FROM "user" WHERE id = $1
            `, [user_id]
        );
        user = q.rows[0];
    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    var purchaseList;
    try {
        const q2 = await pool.query(
            `  
            SELECT P.user_id, P.anime_id, A.romaji_title, A.english_title, SUM(S.price)
            FROM purchase P JOIN anime_studio S
            ON P.anime_id = S.anime_id
            JOIN anime A
            ON P.anime_id = A.id
            WHERE P.user_id = $1
            GROUP BY P.user_id, P.anime_id, A.romaji_title, A.english_title, A.visibility
            ORDER BY A.visibility DESC;
            `, [user_id]
        );
        purchaseList = q2.rows;

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    var total;
    try {
        const q3 = await pool.query(
            `
            SELECT total_cost($1);
            `,[user_id]
        );
        total = q3.rows[0].total_cost;
        console.log('total: ' + total);
    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    var bookmarks;
    try {
        const q4 = await pool.query(
            `
            SELECT A.id, A.romaji_title,  A.english_title, SUM(SA.price)
            FROM bookmarks B JOIN anime A
            ON B.anime_id = A.id
            JOIN anime_studio SA
            ON A.id = SA.anime_id
            WHERE B.user_id = $1
            GROUP BY A.id, A.romaji_title,  A.english_title
            ORDER BY A.visibility;
            `, [user_id]
        );

        bookmarks = q4.rows;
        console.log(bookmarks);
    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    var forum_posts;
    try {
        
        const q5 = await pool.query(
            `
            SELECT * FROM forum_post WHERE user_id = $1
            `, [user_id]
        );
        forum_posts = q5.rows;

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    res.render('user_info', {user: user, list: purchaseList, total: total, bookmarks: bookmarks, posts: forum_posts, username: username});

})

// Recharge balance of a user
app.post('/user/balance/recharge', async(req, res)=>{
    try {
        
        const balance = parseInt(req.body.balance);
        /*const q1 = await pool.query(
            `
            SELECT balance FROM "user" WHERE id = $1
            `, [user_id]
        );
        const old_balance = q1.rows[0].balance;
        const q2 = await pool.query(
            `
            UPDATE "user" SET balance = $1 WHERE id = $2
            `, [balance + old_balance, user_id]
        );*/

        const q1 = await pool.query(
            `
            CALL recharge_balance($1, $2)
            `, [user_id, balance]
        );

        res.redirect('/user_info');

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/studio', (req, res) => {
    res.render('studio_login');
})

app.get('/studio/names', async (req, res) => {
    const name = req.query.studio_name;
    var studios;

    try {
        const q1 = await pool.query(
            `
            SELECT * FROM studio
            WHERE UPPER("name") LIKE $1;
            `, [`%${name.toUpperCase()}%`]
        );
        studios = q1.rows;
    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    res.render('all_studio', { list: studios ,username: username})
    
})

// Display studio info from user side
app.get('/user/studio/individual/:id', async(req, res)=>{
    const id = req.params.id;

    try {
        
        const animelist = await pool.query(
            `
            SELECT A.id, A.romaji_title, A.english_title, A.imagelink, COALESCE(T.count, 0) AS user_count
            FROM anime_studio SA JOIN anime A ON A.id = SA.anime_id
            LEFT JOIN 
            (
                SELECT anime_id, COUNT(user_id)
                FROM purchase P
                GROUP BY P.anime_id
            ) T ON T.anime_id = SA.anime_id
            WHERE SA.studio_id = $1
            ORDER BY COALESCE(T.count, 0) DESC
            `, [id]
        );

        res.render('studio_animes', {animelist: animelist.rows, username: username});

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Display Studio sales history from studio side
app.get('/studio/individual/:id', async (req, res) => {
    const studio_id = req.params.id;
    
    const q = await pool.query(
        `
        SELECT name FROM studio WHERE id = $1
        `, [studio_id]
    )

    studioname = q.rows[0].name;

    const total_income = await pool.query(
        `
        SELECT total_revenue_studio($1)
        `, [studio_id]
    );

    try {
        const q1 = await pool.query(
            `
            SELECT S."name", A.romaji_title, A.english_title, SA.price
            FROM studio S JOIN anime_studio SA
            ON S.id = SA.studio_id
            JOIN anime A
            ON SA.anime_id = A.id
            WHERE S.id = $1
            ORDER BY A.visibility DESC
            `,[studio_id]
        );

        const q2 = await pool.query(
            `
            SELECT S."name", A.romaji_title, A.english_title, SUM(SA.price), COUNT(P.user_id)
            FROM studio S JOIN anime_studio SA
            ON S.id = SA.studio_id
            JOIN anime A
            ON SA.anime_id = A.id
            JOIN purchase P
            ON SA.anime_id = P.anime_id
            WHERE S.id = $1
            GROUP BY S.id, S."name", A.id, A.romaji_title, A.english_title
            ORDER BY A.visibility DESC;
            `,[studio_id]
        );

        const q3 = await pool.query(
            `
            SELECT U.id, U.first_name || ' ' || U.last_name AS username, U.email, F.date_followed
            FROM follow F 
            JOIN "user" U ON U.id = F.user_id
            WHERE F.studio_id = $1
            ORDER BY F.date_followed DESC
            `, [studio_id]
        );

        res.render('studio_info', {total_income: total_income.rows[0].total_revenue_studio, 
                                    list: q1.rows, 
                                    sales: q2.rows, 
                                    followers: q3.rows,
                                    username: studioname})

    } catch (error) {
        console.log(error);
    }
})

//Get an anime name
app.get('/anime', (req, res) => {
    console.log(user_id);
    res.render('get_anime');
})

// Display all animes by that name
app.get('/anime_info', (req, res) => {
    console.log(user_id, username);
    
    const name = req.query.name;
    console.log(name);
    pool.query(
        `SELECT *
        FROM anime
        WHERE UPPER(romaji_title) LIKE $1 OR UPPER(english_title) LIKE $2`, [`%${name.toUpperCase()}%`, `%${name.toUpperCase()}%`]
    )    
    .then(result => {
        console.log(result.rows);
        //res.json(result.rows[0]);
        res.render('all_anime', {animelist: result.rows, username: username});
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

// View details for a particular anime
app.get('/individual_anime/:id', async (req, res) => {
    const id = req.params.id;

    const anime = await pool.query(
        `
        SELECT *,
        (
        SELECT SUM(SA.price)
        FROM anime_studio SA
        WHERE SA.anime_id = A.id
        ) AS price
        FROM anime A
        WHERE id = $1;
        `, [id]
    );

    const status = await pool.query(
        `
        SELECT is_purchased($1, $2)
        `,[user_id, id]
    );
    const isPurchased = status.rows[0].is_purchased;
    console.log('isPurchased: ' + isPurchased);

    const q = await pool.query(
        `
        SELECT is_bookmarked($1, $2)
        `, [user_id, id]
    );
    const isBookmarked = q.rows[0].is_bookmarked;

    const studios = await pool.query(
        `
        SELECT S."id", S."name"
        FROM anime_studio SA JOIN studio S
        ON SA.studio_id = S."id" 
        WHERE anime_id = $1;
        `, [id]
    );

    const characters = await pool.query(
        `
        SELECT C.id, C."name", C.imagelink
        FROM "character" C 
        JOIN anime_character AC ON AC.character_id = C.id
        WHERE AC.anime_id = $1
        `, [id]
    );

    const reviews = await pool.query(
        `
        SELECT U.first_name || ' ' || U.last_name AS user_name, AR.*
        FROM anime_review AR 
        JOIN "user" U ON U.id = AR.user_id
        WHERE AR.anime_id = $1
        `, [id]
    );

    const forum_posts = await pool.query(
        `
        SELECT U.first_name || ' ' || U.last_name AS user_name, FP.id, FP.title, FP.date_posted
        FROM forum_post FP 
        JOIN "user" U ON U.id = FP.user_id
        WHERE FP.anime_id = $1;
        `, [id]
    );

    const seasons = await pool.query(
        `
        SELECT S.id, S.season_number, ST."name", SA.price
        FROM anime_studio SA JOIN studio ST ON ST.id = SA.studio_id
        JOIN season S ON S.id = SA.season_id
        WHERE SA.anime_id = $1
        `, [id]
    );

    res.render('anime_info', {
        anime: anime.rows[0],
        studiolist: studios.rows,
        isPurchased: isPurchased,
        isBookmarked: isBookmarked,
        username: username,
        characterlist: characters.rows,
        reviewlist: reviews.rows,
        forum_posts: forum_posts.rows,
        seasons: seasons.rows
    });
})

// Bookmark a particular anime
app.get('/bookmark_anime/:id', (req, res) => {
    const anime_id = req.params.id;

    pool.query(
        `
        INSERT INTO bookmarks (user_id, anime_id) VALUES ($1, $2)
        `,[user_id, anime_id]
    )
    .then(result => {
        res.redirect('/individual_anime/' + anime_id);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

// Purchase a particular anime
app.get('/purchase_anime/:id', (req, res) => {
    const anime_id = req.params.id;

    pool.query(
        `
        INSERT INTO purchase (user_id, anime_id, watched) VALUES ($1, $2, $3)
        `,[user_id, anime_id, 'f']
        //`
        //CALL handle_purchase($1, $2)
        //`, [user_id, anime_id]
    )
    .then(result => {
        res.redirect('/user_info');
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
});

// Refund a particular anime
app.get('/anime/refund/:id', async(req, res)=>{
    try {
        
        const anime_id = req.params.id;

        await pool.query(
            `
            DELETE FROM purchase WHERE user_id = $1 AND anime_id = $2
            `, [user_id, anime_id]
        );
        res.redirect('/user_info');

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Get a particular character
app.get('/character/:id', async(req, res)=>{
    try {
        
        const id = req.params.id;
        const character = await pool.query(
            `
            SELECT * FROM "character" WHERE id = $1
            `, [id]
        );
        console.log(character, username);
        res.render('character_info', {character: character.rows[0], username: username});

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Go to forum
app.get('/forum', async(req, res) => {
    try {
        
        const posts = await pool.query(
            `
            SELECT FP.id, FP.anime_id, FP.character_id, FP.title, FP.user_id, U.first_name || ' ' || U.last_name AS user_name, FP.date_posted
            FROM forum_post FP
            JOIN "user" U ON U.id = FP.user_id
            ORDER BY date_posted DESC
            `
        );

        console.log(user_id, username);
        res.render('forum.ejs', {posts: posts.rows, username: username});

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a particular forum post
app.get('/forum/:id', async(req, res) => {
    try {
        console.log("in forum");
        
        const id = req.params.id;
        const topic = await pool.query(
            `
            SELECT topic FROM forum_post WHERE id = $1
            `, [id]
        );

        const comments = await pool.query(
            `
            SELECT FC.id, FC.post_id, FC.user_id, U.first_name || ' ' || U.last_name AS name, FC.body, FC.date_commented
            FROM forum_comment FC 
            JOIN "user" U ON U.id = FC.user_id
            WHERE FC.post_id = $1
            `, [id]
        );

        const vote_counts = await pool.query(
            `
            SELECT upvote, COUNT(*)
            FROM forum_post_vote FV 
            WHERE post_id = $1
            GROUP BY upvote
            `, [id]
        );

        let upvotes = 0;
        let downvotes = 0;
        if(vote_counts.rows.length == 2){
            upvotes = vote_counts.rows[1].count;
            downvotes = vote_counts.rows[0].count;
        }
        else if(vote_counts.rows.length == 1){
            if(vote_counts.rows[0].upvote == true){
                upvotes = vote_counts.rows[0].count;
            }
            else{
                downvotes = vote_counts.rows[0].count;
            }
        }
        console.log(upvotes, downvotes);
        console.log(topic.rows[0]);

        if(topic.rows[0].topic == 'anime'){
            console.log('here');
            const post = await pool.query(
                `
                SELECT FP.*, A.romaji_title, A.english_title, U.first_name || ' ' || U.last_name AS user_name
                FROM forum_post FP
                JOIN anime A ON A.id = FP.anime_id
                JOIN "user" U ON U.id = FP.user_id
                WHERE FP.id = $1
                `, [id]
            );

            res.render('forum_post', {post: post.rows[0], comments: comments.rows, votes: {upvotes, downvotes}, username: username});
        }
        else if(topic.rows[0].topic == 'character'){
            const post = await pool.query(
                `
                SELECT FP.*, C."name", U.first_name || ' ' || U.last_name AS user_name
                FROM forum_post FP
                JOIN "character" C ON C.id = FP.character_id
                JOIN "user" U ON U.id = FP.user_id
                WHERE FP.id = $1
                `, [id]
            );

            res.render('forum_post', {post: post.rows[0], comments: comments.rows, votes: {upvotes, downvotes}, username: username});
        }
        else{
            const post = await pool.query(
                `
                SELECT FP.*, U.first_name || ' ' || U.last_name AS user_name
                FROM forum_post FP
                JOIN "user" U ON U.id = FP.user_id
                WHERE FP.id = $1
                `, [id]
            );

            res.render('forum_post', {post: post.rows[0], comments: comments.rows, votes: {upvotes, downvotes}, username: username});
        }

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle votes
app.post('/forum/vote', async(req, res)=>{
    //const {post_id, user_id, upvote} = req.body;
    const post_id = req.body.post_id;
    //const user_id = req.body.user_id;
    const upvote = req.body.upvote;
    console.log(req.body);
    console.log(post_id, user_id, upvote);

    try {
        
        const result = await pool.query(
            `
            INSERT INTO forum_post_vote (post_id, user_id, upvote) VALUES ($1, $2, $3) RETURNING *
            `, [post_id, user_id, upvote]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add comments to a forum post
app.post('/forum/comment', async(req, res)=>{
    try {
        
        const {post_id, body} = req.body;

        const q = await pool.query(
            `
            INSERT INTO forum_comment (post_id, user_id, body) VALUES ($1, $2, $3)
            `, [post_id, user_id, body]
        );

        res.json({message: 'Comment added'});

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create new forum post
app.post('/forum/create', async(req, res)=>{
    try {
        
        const {title, body} = req.body;

        const q = await pool.query(
            `
            INSERT INTO forum_post (user_id, title, body) VALUES ($1, $2, $3)
            `, [user_id, title, body]
        );

        res.redirect('/forum');

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a forum post
app.post('/forum/delete/:id', async(req, res)=>{
    try {
        
        const id = req.params.id;
        const q = await pool.query(
            `
            DELETE FROM forum_post WHERE id = $1
            `, [id]
        );
        res.redirect('/user_info');

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})









app.get('/add_user', (req, res) => {
    res.render('add_user');
})

app.get('/delete_user', (req, res) => {
    res.render('delete_user');
})

app.post('/add', (req, res) => {
    console.log(req.body);
    
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const gender = req.body.gender;
    const password = req.body.password;

    pool.query(
        `INSERT INTO "user" (first_name, last_name, email, gender, password)
        VALUES ($1, $2, $3, $4, $5)`,[first_name, last_name, email, gender, password]
    )
    .then(result => {
        console.log(result.rows);
        res.send('<h1>added</h1>');
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

app.post('/delete', (req, res) => {
    console.log(req.body);
    
    const id = req.body.id;

    pool.query(
        `DELETE FROM "user" WHERE id = $1`,[id]
    )
    .then(result => {
        console.log(result.rows);
        res.send('<h1>deleted</h1>');
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
});

app.get('/test', (req, res)=>{
    console.log("in test");
    res.render('test');
});

app.get('/logout', (req,res) => {
    user_id = null;
    username = null;
    studio_id = null;
    studioname = null;
    res.redirect('/');
})