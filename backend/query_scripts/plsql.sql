-- Trigger to handle upvoting / downvoting in forum posts

CREATE OR REPLACE TRIGGER VOTE
BEFORE INSERT 
ON forum_post_vote
FOR EACH ROW
DECLARE
duplicate_insertion EXCEPTION;
BEGIN

    FOR R IN (SELECT * FROM forum_post_vote WHERE post_id = :NEW.post_id AND user_id = :NEW.user_id)
    LOOP
    IF R.upvote = :NEW.upvote THEN
        DELETE FROM forum_post_vote WHERE post_id = R.post_id AND user_id = R.user_id;
        RAISE duplicate_insertion;
    ELSE 
        DELETE FROM forum_post_vote WHERE post_id = R.post_id AND user_id = R.user_id;
    END IF;
    END LOOP;

EXCEPTION 
    WHEN duplicate_insertion THEN
        RAISE_APPLICATION_ERROR(-20001, 'Duplicate insertion handled.');
END;



CREATE OR REPLACE FUNCTION vote_trigger()
RETURNS TRIGGER AS $$
DECLARE
    duplicate_insertion BOOLEAN := FALSE;
    r_record RECORD;
    post_id_to_delete INT;
    user_id_to_delete INT;
BEGIN
    -- Declare a cursor to fetch rows
    FOR r_record IN SELECT post_id, user_id, upvote FROM forum_post_vote WHERE post_id = NEW.post_id AND user_id = NEW.user_id LOOP
        post_id_to_delete := r_record.post_id;
        user_id_to_delete := r_record.user_id;
        IF r_record.upvote = NEW.upvote THEN
            -- If a match is found, set the flag and get post_id and user_id for deletion
            duplicate_insertion := TRUE;
            
        END IF;
    END LOOP;

    IF duplicate_insertion THEN
        -- If a duplicate insertion is detected, delete the existing record
        DELETE FROM forum_post_vote WHERE post_id = post_id_to_delete AND user_id = user_id_to_delete;
        RETURN NULL; -- Do nothing when duplicate insertion occurs
    ELSE
        DELETE FROM forum_post_vote WHERE post_id = post_id_to_delete AND user_id = user_id_to_delete;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER vote_trigger
BEFORE INSERT ON forum_post_vote
FOR EACH ROW
EXECUTE FUNCTION vote_trigger();




-- Trigger to delete from bookmark when a purchase is made

CREATE OR REPLACE TRIGGER PURCHASE_HANDLE
BEFORE INSERT 
ON purchase 
FOR EACH ROW 
DECLARE 

BEGIN

    DELETE FROM bookmarks 
    WHERE user_id = :NEW.user_id AND anime_id = :NEW.anime_id;

END;



CREATE OR REPLACE FUNCTION purchase_handle()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM bookmarks 
    WHERE user_id = NEW.user_id AND anime_id = NEW.anime_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchase_handle
BEFORE INSERT ON purchase
FOR EACH ROW
EXECUTE FUNCTION purchase_handle();


DROP TRIGGER IF EXISTS purchase_handle ON purchase;
DROP FUNCTION IF EXISTS purchase_handle;




-- Trigger to handle forum post deletion

CREATE OR REPLACE TRIGGER DELETE_FORUM_POST_HANDLE
BEFORE DELETE 
ON forum_post
FOR EACH ROW
DECLARE 

BEGIN 

    DELETE FROM forum_post_vote WHERE post_id = :OLD.id;
    DELETE FROM forum_comment WHERE post_id = :OLD.id;

END;


CREATE OR REPLACE FUNCTION delete_forum_post_handle()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM forum_post_vote WHERE post_id = OLD.id;
    DELETE FROM forum_comment WHERE post_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delete_forum_post_handle
BEFORE DELETE ON forum_post
FOR EACH ROW
EXECUTE FUNCTION delete_forum_post_handle();



-- Function to calculate total expenditure of a user 

CREATE OR REPLACE FUNCTION TOTAL_COST(userID IN NUMBER)
RETURN NUMBER IS
TOTAL_PRICE NUMBER,
ANIME_ID NUMBER
BEGIN

    TOTAL_PRICE := 0;
    FOR R IN (SELECT * FROM purchase WHERE user_id = userID)
    LOOP

    ANIME_ID := R.anime_id;
    FOR S IN (SELECT * FROM anime_studio WHERE anime_id = ANIME_ID)
    LOOP

    TOTAL_PRICE := TOTAL_PRICE + S.price;

    END LOOP;

    END LOOP;

    RETURN TOTAL_PRICE;

END;

SELECT TOTAL_COST(2);


CREATE OR REPLACE FUNCTION total_cost(user_id_param INTEGER)
RETURNS NUMERIC AS $$
DECLARE
    total_price NUMERIC := 0;
    anime_id_param INTEGER;
    r RECORD;
    s RECORD;
BEGIN
    FOR r IN SELECT * FROM purchase WHERE user_id = user_id_param LOOP
        anime_id_param := r.anime_id;
        FOR s IN SELECT * FROM anime_studio WHERE anime_id = anime_id_param LOOP
            total_price := total_price + s.price;
        END LOOP;
    END LOOP;
    RETURN total_price;
END;
$$ LANGUAGE plpgsql;

SELECT total_cost(2);



-- Function to validate user login
CREATE OR REPLACE FUNCTION IS_VALID_USER(EMAIL IN VARCHAR(100), U_PASSWORD IN VARCHAR(100))
RETURN BOOLEAN IS
    V_PASS VARCHAR(100);
BEGIN
    SELECT "password" INTO V_PASS 
    FROM "user" WHERE email = EMAIL;
    
    IF V_PASS = U_PASSWORD THEN
        RETURN TRUE;
    ELSE 
        RETURN FALSE;
    END IF;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN FALSE;  -- Handle case where email is not found in the database
END;



CREATE OR REPLACE FUNCTION is_valid_user(email_param VARCHAR(100), u_password_param VARCHAR(100))
RETURNS BOOLEAN AS $$
DECLARE
    v_pass VARCHAR(100);
BEGIN
    SELECT "password" INTO v_pass 
    FROM "user" WHERE LOWER(email) = LOWER(email_param);
    
    IF v_pass = u_password_param THEN
        RETURN TRUE;
    ELSE 
        RETURN FALSE;
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN FALSE;  -- Handle case where email is not found in the database
END;
$$ LANGUAGE plpgsql;




-- Procedure to handle purchase
CREATE OR REPLACE PROCEDURE HANDLE_PURCHASE(USER_ID IN NUMBER, ANIME_ID IN NUMBER) IS
U_BALANCE NUMBER;
ANIME_PRICE NUMBER;
BEGIN

    SELECT balance INTO U_BALANCE
    FROM "user"
    WHERE id = USER_ID;

    SELECT SUM(price) INTO ANIME_PRICE
    FROM anime_studio 
    WHERE anime_id = ANIME_ID;

    IF U_BALANCE >= ANIME_PRICE THEN
        UPDATE "user" SET balance = U_BALANCE - ANIME_PRICE
        WHERE id = USER_ID;

        INSERT INTO purchase (user_id, anime_id, watched) VALUES (USER_ID, ANIME_ID, false);

        DELETE FROM bookmarks 
        WHERE user_id = USER_ID AND anime_id = ANIME_ID;
    END IF;

END;


CREATE OR REPLACE PROCEDURE handle_purchase(user_id_param INTEGER, anime_id_param INTEGER) AS $$
DECLARE
    u_balance NUMERIC;
    anime_price NUMERIC;
BEGIN
    SELECT balance INTO u_balance
    FROM "user"
    WHERE id = user_id_param;

    SELECT SUM(price) INTO anime_price
    FROM anime_studio 
    WHERE anime_id = anime_id_param;

    IF u_balance >= anime_price THEN
        UPDATE "user" SET balance = u_balance - anime_price
        WHERE id = user_id_param;

        INSERT INTO purchase (user_id, anime_id, watched) VALUES (user_id_param, anime_id_param, false);

        DELETE FROM bookmarks 
        WHERE user_id = user_id_param AND anime_id = anime_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP PROCEDURE IF EXISTS handle_purchase;




-- Trigger to handle purchase

CREATE OR REPLACE TRIGGER HANDLE_PURCHASE
BEFORE INSERT
ON purchase
FOR EACH ROW
DECLARE
U_BALANCE NUMBER;
ANIME_PRICE NUMBER;
INSUFFICIENT_BALANCE EXCEPTION;
BEGIN

    SELECT balance INTO U_BALANCE
    FROM "user"
    WHERE id = :NEW.user_id;

    SELECT SUM(price) INTO ANIME_PRICE
    FROM anime_studio 
    WHERE anime_id = :NEW.anime_id;

    IF U_BALANCE >= ANIME_PRICE THEN
        UPDATE "user" SET balance = U_BALANCE - ANIME_PRICE
        WHERE id = :NEW.user_id;

        DELETE FROM bookmarks 
        WHERE user_id = USER_ID AND anime_id = ANIME_ID;
    ELSE
        RAISE INSUFFICIENT_BALANCE;
    END IF;

EXCEPTION
    WHEN INSUFFICIENT_BALANCE THEN
        RAISE_APPLICATION_ERROR(-20001, 'Insufficient balance.');

END;



CREATE OR REPLACE FUNCTION handle_purchase_trigger() RETURNS TRIGGER AS $$
DECLARE
    u_balance NUMERIC;
    anime_price NUMERIC;
BEGIN
    SELECT balance INTO u_balance
    FROM "user"
    WHERE id = NEW.user_id;

    SELECT SUM(price) INTO anime_price
    FROM anime_studio 
    WHERE anime_id = NEW.anime_id;

    IF u_balance >= anime_price THEN
        UPDATE "user" SET balance = u_balance - anime_price
        WHERE id = NEW.user_id;

        DELETE FROM bookmarks 
        WHERE user_id = NEW.user_id AND anime_id = NEW.anime_id;
    ELSE
        RETURN NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER handle_purchase_trigger
BEFORE INSERT ON purchase
FOR EACH ROW
EXECUTE FUNCTION handle_purchase_trigger();



-- Procedure to recharge balance of a user
CREATE OR REPLACE PROCEDURE RECHARGE_BALANCE(USER_ID IN NUMBER, RECHARGE_AMOUNT IN NUMBER) IS
OLD_BALANCE NUMBER;
NEW_BALANCE NUMBER;
BEGIN

SELECT balance INTO OLD_BALANCE
FROM "user" WHERE id = USER_ID;

NEW_BALANCE := OLD_BALANCE + RECHARGE_AMOUNT;

UPDATE "user" SET balance = NEW_BALANCE;

END;



CREATE OR REPLACE PROCEDURE recharge_balance(user_id_param INTEGER, recharge_amount_param NUMERIC) AS $$
DECLARE
    old_balance NUMERIC;
    new_balance NUMERIC;
BEGIN
    SELECT balance INTO old_balance
    FROM "user" WHERE id = user_id_param;

    new_balance := old_balance + recharge_amount_param;

    UPDATE "user" SET balance = new_balance WHERE id = user_id_param;

END;
$$ LANGUAGE plpgsql;


-- Function to check if an anime is purchased or not
CREATE OR REPLACE FUNCTION IS_PURCHASED(P_USER_ID IN NUMBER, P_ANIME_ID IN NUMBER)
RETURN BOOLEAN IS
V_STATUS NUMBER;
BEGIN

SELECT COUNT(*) INTO V_STATUS
FROM purchase
WHERE user_id = P_USER_ID AND anime_id = P_ANIME_ID;

IF V_STATUS = 0 THEN
    RETURN FALSE;
ELSE
    RETURN TRUE;
END IF;

END;


CREATE OR REPLACE FUNCTION is_purchased(p_user_id_param INTEGER, p_anime_id_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    v_status INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_status
    FROM purchase
    WHERE user_id = p_user_id_param AND anime_id = p_anime_id_param;

    IF v_status = 0 THEN
        RETURN FALSE;
    ELSE
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Function to check if an anime is bookmarked or not
CREATE OR REPLACE FUNCTION IS_BOOKMARKED(P_USER_ID IN NUMBER, P_ANIME_ID IN NUMBER)
RETURN BOOLEAN IS
V_STATUS NUMBER;
BEGIN

SELECT COUNT(*) INTO V_STATUS
FROM bookmarks
WHERE user_id = P_USER_ID AND anime_id = P_ANIME_ID;

IF V_STATUS = 0 THEN
    RETURN FALSE;
ELSE
    RETURN TRUE;
END IF;

END;



CREATE OR REPLACE FUNCTION is_bookmarked(p_user_id_param INTEGER, p_anime_id_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    v_status INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_status
    FROM bookmarks
    WHERE user_id = p_user_id_param AND anime_id = p_anime_id_param;

    IF v_status = 0 THEN
        RETURN FALSE;
    ELSE
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Function to calculate total revenue of a studio
CREATE OR REPLACE FUNCTION TOTAL_REVENUE_STUDIO(P_STUDIO_ID IN NUMBER)
RETURN NUMBER IS
U_COUNT NUMBER;
TOTAL_REVENUE NUMBER := 0;
BEGIN

FOR R IN (SELECT anime_id FROM anime_studio WHERE studio_id = P_STUDIO_ID)
LOOP
    SELECT COUNT(user_id) INTO U_COUNT 
    FROM purchase 
    WHERE anime_id = R.anime_id;

    IF U_COUNT IS NOT NULL THEN 
        TOTAL_REVENUE := TOTAL_REVENUE + U_COUNT * R.price;
    END IF;
END LOOP;
RETURN TOTAL_REVENUE;

END;


CREATE OR REPLACE FUNCTION total_revenue_studio(p_studio_id_param INTEGER)
RETURNS NUMERIC AS $$
DECLARE
    u_count INTEGER;
    total_revenue NUMERIC := 0;
    r RECORD;
BEGIN
    FOR r IN SELECT anime_id, price FROM anime_studio WHERE studio_id = p_studio_id_param LOOP
        SELECT COUNT(user_id) INTO u_count 
        FROM purchase 
        WHERE anime_id = r.anime_id;

        IF u_count IS NOT NULL THEN 
            total_revenue := total_revenue + u_count * r.price;
        END IF;
    END LOOP;

    RETURN total_revenue;
END;
$$ LANGUAGE plpgsql;



-- Trigger to refund an anime
CREATE OR REPLACE TRIGGER REFUND_ANIME
BEFORE DELETE 
ON purchase
FOR EACH ROW
DECLARE
U_BALANCE NUMBER;
ANIME_PRICE NUMBER;
V_PURCHASE_TIME TIMESTAMP;
V_REFUND_TIME_LIMIT INTERVAL;
V_REFUND_RATE DOUBLE PRECISION;
VALIDITY_EXPIRED EXCEPTION;
BEGIN

SELECT balance INTO U_BALANCE
FROM "user"
WHERE id = :OLD.user_id;

SELECT SUM(price) INTO ANIME_PRICE
FROM anime_studio 
WHERE anime_id = :OLD.anime_id;

SELECT timestamp_purchased INTO V_PURCHASE_TIME
FROM purchase
WHERE user_id = :OLD.user_id AND anime_id = :OLD.anime_id;

FOR R IN (SELECT studio_id FROM anime_studio WHERE anime_id = :OLD.anime_id)
LOOP
    SELECT refund_time_limit, refund_rate INTO V_REFUND_TIME_LIMIT, V_REFUND_RATE
    FROM studio
    WHERE id = R.studio_id;

    IF CURRENT_TIMESTAMP - V_PURCHASE_TIME <= V_REFUND_TIME_LIMIT THEN
        UPDATE "user" SET balance = U_BALANCE + V_REFUND_RATE * ANIME_PRICE
        WHERE id = :OLD.user_id;
    ELSE
        RAISE VALIDITY_EXPIRED;
    END IF;
END LOOP;

EXCEPTION
    WHEN VALIDITY_EXPIRED THEN
        RAISE_APPLICATION_ERROR(-20001, 'Refund validity expired');

END;



CREATE OR REPLACE FUNCTION refund_anime_trigger() RETURNS TRIGGER AS $$
DECLARE
    u_balance NUMERIC;
    anime_price NUMERIC;
    v_purchase_time TIMESTAMP;
    v_refund_time_limit INTERVAL;
    v_refund_rate DOUBLE PRECISION;
    r RECORD;
    balance_count NUMERIC;
BEGIN
    SELECT balance INTO u_balance
    FROM "user"
    WHERE id = OLD.user_id;

    balance_count := u_balance;

    SELECT SUM(price) INTO anime_price
    FROM anime_studio 
    WHERE anime_id = OLD.anime_id;

    SELECT timestamp_purchased INTO v_purchase_time
    FROM purchase
    WHERE user_id = OLD.user_id AND anime_id = OLD.anime_id;

    FOR r IN SELECT studio_id, price FROM anime_studio WHERE anime_id = OLD.anime_id LOOP
        SELECT refund_time_limit, refund_rate INTO v_refund_time_limit, refund_rate
        FROM studio
        WHERE id = r.studio_id;
        
        IF CURRENT_TIMESTAMP - v_purchase_time <= v_refund_time_limit THEN
            balance_count = balance_count + v_refund_rate * r.price;
        END IF;
    END LOOP;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER refund_anime_trigger
BEFORE DELETE ON purchase
FOR EACH ROW
EXECUTE FUNCTION refund_anime_trigger();



-- Trigger to validate user signup
CREATE OR REPLACE TRIGGER VALIDATE_USER_SIGNUP
BEFORE INSERT
ON "user"
FOR EACH ROW
DECLARE
V_EMAIL_COUNT NUMBER;
BEGIN

SELECT COUNT(*) INTO V_EMAIL_COUNT
FROM "user"
WHERE email = :NEW.email;

IF V_EMAIL_COUNT > 0 THEN
    RAISE_APPLICATION_ERROR(-20001, 'Duplicate email.');
END IF;

END;



CREATE OR REPLACE FUNCTION validate_user_signup_trigger() RETURNS TRIGGER AS $$
DECLARE
    v_email_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_email_count
    FROM "user"
    WHERE email = NEW.email;

    IF v_email_count > 0 THEN
        RAISE EXCEPTION 'Duplicate email';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_user_signup_trigger
BEFORE INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION validate_user_signup_trigger();



-- Trigger to insert an anime review/ rating
CREATE OR REPLACE TRIGGER HANDLE_ANIME_REVIEW
BEFORE INSERT
ON anime_review
FOR EACH ROW
DECLARE
IS_PRESENT NUMBER;
BEGIN

SELECT COUNT(*) INTO IS_PRESENT
FROM anime_review
WHERE user_id = :NEW.user_id AND anime_id = :NEW.anime_id;

IF IS_PRESENT > 0 THEN
    IF :NEW.body IS NULL THEN
        UPDATE anime_review SET rating = :NEW.rating
        WHERE user_id = :NEW.user_id AND anime_id = :NEW.anime_id;
        RAISE_APPLICATION_ERROR(-20001, 'Rating updated.');
    ELSIF :NEW.rating IS NULL THEN
        UPDATE anime_review SET body = :NEW.body
        WHERE user_id = :NEW.user_id AND anime_id = :NEW.anime_id;
        RAISE_APPLICATION_ERROR(-20001, 'Review updated.');
    END IF;
END IF;

END;



CREATE OR REPLACE FUNCTION handle_anime_review_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM anime_review
        WHERE user_id = NEW.user_id AND anime_id = NEW.anime_id
    ) THEN
        IF NEW.body IS NULL THEN
            UPDATE anime_review SET rating = NEW.rating
            WHERE user_id = NEW.user_id AND anime_id = NEW.anime_id;
            RETURN NULL;
        ELSIF NEW.rating IS NULL THEN
            UPDATE anime_review SET body = NEW.body
            WHERE user_id = NEW.user_id AND anime_id = NEW.anime_id;
            RETURN NULL;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_anime_review_trigger
BEFORE INSERT ON anime_review
FOR EACH ROW
EXECUTE FUNCTION handle_anime_review_trigger();


-- Procedure to handle anime rating
CREATE OR REPLACE PROCEDURE HANDLE_ANIME_RATING(P_ANIME_ID IN NUMBER, P_USER_ID IN NUMBER, P_RATING IN NUMBER) IS
IS_PRESENT NUMBER;
BEGIN

SELECT COUNT(*) INTO IS_PRESENT
FROM anime_review
WHERE user_id = P_USER_ID AND anime_id = P_ANIME_ID;

IF IS_PRESENT > 0 THEN
    UPDATE anime_review SET rating = P_RATING
    WHERE user_id = P_USER_ID AND anime_id = P_ANIME_ID;
ELSE
    INSERT INTO anime_review (user_id, anime_id, rating)
    VALUES (P_USER_ID, P_ANIME_ID, P_RATING);
END IF;

END;


CREATE OR REPLACE PROCEDURE handle_anime_rating(p_anime_id_param INTEGER, p_user_id_param INTEGER, p_rating_param INTEGER) AS $$
DECLARE
    is_present INTEGER;
BEGIN
    SELECT COUNT(*) INTO is_present
    FROM anime_review
    WHERE user_id = p_user_id_param AND anime_id = p_anime_id_param;

    IF is_present > 0 THEN
        UPDATE anime_review SET rating = p_rating_param
        WHERE user_id = p_user_id_param AND anime_id = p_anime_id_param;
    ELSE
        INSERT INTO anime_review (user_id, anime_id, rating)
        VALUES (p_user_id_param, p_anime_id_param, p_rating_param);
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Procedure to handle anime review
CREATE OR REPLACE PROCEDURE HANDLE_ANIME_REVIEW(P_ANIME_ID IN NUMBER, P_USER_ID IN NUMBER, P_REVIEW_BODY IN VARCHAR(5000)) IS
IS_PRESENT NUMBER;
BEGIN

SELECT COUNT(*) INTO IS_PRESENT
FROM anime_review
WHERE user_id = P_USER_ID AND anime_id = P_ANIME_ID;

IF IS_PRESENT > 0 THEN
    UPDATE anime_review SET body = P_REVIEW_BODY
    WHERE user_id = P_USER_ID AND anime_id = P_ANIME_ID;
ELSE
    INSERT INTO anime_review (user_id, anime_id, body)
    VALUES (P_USER_ID, P_ANIME_ID, P_REVIEW_BODY);
END IF;

END;


CREATE OR REPLACE PROCEDURE handle_anime_review(p_anime_id_param INTEGER, p_user_id_param INTEGER, p_review_body_param VARCHAR(5000)) AS $$
DECLARE
    is_present INTEGER;
BEGIN
    SELECT COUNT(*) INTO is_present
    FROM anime_review
    WHERE user_id = p_user_id_param AND anime_id = p_anime_id_param;

    IF is_present > 0 THEN
        UPDATE anime_review SET body = p_review_body_param
        WHERE user_id = p_user_id_param AND anime_id = p_anime_id_param;
    ELSE
        INSERT INTO anime_review (user_id, anime_id, body)
        VALUES (p_user_id_param, p_anime_id_param, p_review_body_param);
    END IF;
END;
$$ LANGUAGE plpgsql;













































-- Populate season table
DECLARE
TOTAL_SEASONS NUMBER;
SEASONID_COUNT NUMBER;
V_COUNT NUMBER;
BEGIN

SELECT COUNT(*) INTO TOTAL_SEASONS FROM anime_studio;
FOR I IN 1..TOTAL_SEASONS
LOOP
    INSERT INTO season (season_number) VALUES (1);
END LOOP;

SEASONID_COUNT := 1;
FOR R IN (SELECT id FROM anime)
LOOP
    V_COUNT := 1;
    FOR P IN (SELECT * FROM anime_studio WHERE anime_id = R.id)
    LOOP
        UPDATE anime_studio SET season_id = SEASONID_COUNT
        WHERE anime_id = P.anime_id AND studio_id = P.studio_id;
        SEASONID_COUNT := SEASONID_COUNT + 1;

        UPDATE season SET season_number = V_COUNT WHERE id = SEASONID_COUNT;
        V_COUNT := V_COUNT + 1;
    END LOOP;
END LOOP;

END;



DO $$
DECLARE
    total_seasons INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_seasons FROM anime_studio;
    
    FOR i IN 1..total_seasons LOOP
        INSERT INTO season (season_number) VALUES (1);
    END LOOP;
END $$;


DO $$
DECLARE
    total_seasons INTEGER;
    seasonid_count INTEGER := 1;
    v_count INTEGER;
    r_record RECORD;
    p_record RECORD;
BEGIN
    SELECT COUNT(*) INTO total_seasons FROM anime_studio;

    FOR r_record IN (SELECT DISTINCT id FROM anime) LOOP
        v_count := 1;
        FOR p_record IN (SELECT * FROM anime_studio WHERE anime_id = r_record.id) LOOP
            UPDATE anime_studio SET season_id = seasonid_count
            WHERE anime_id = p_record.anime_id AND studio_id = p_record.studio_id;

            UPDATE season SET season_number = v_count WHERE id = seasonid_count;
            
            v_count := v_count + 1;
            seasonid_count := seasonid_count + 1;
        END LOOP;
    END LOOP;
END $$;


-- Populate episode table
DECLARE 
V_NUM_SEASON NUMBER;
EPISODE_COUNT NUMBER;
BEGIN

FOR A IN (SELECT id, episodes FROM anime)
LOOP

    SELECT COUNT(*) INTO V_NUM_SEASON
    FROM anime_studio
    WHERE anime_id = A.id;

    IF V_NUM_SEASON > 0 THEN
        EPISODE_COUNT := CEIL(A.episodes / V_NUM_SEASON);

        FOR S IN (SELECT season_id FROM anime_studio WHERE anime_id = A.id)
        LOOP
            FOR i IN 1..EPISODE_COUNT LOOP
                INSERT INTO episode (season_id, episode_number, link)
                VALUES (S.season_id, i, 'https://youtu.be/fQ6PRbh-ntM');
            END LOOP;
        END LOOP;
    END IF;

END LOOP;

END;



DO $$
DECLARE 
    v_num_season INTEGER;
    episode_count INTEGER;
    v_season_id INTEGER;
    a RECORD;
    s RECORD;
BEGIN
    FOR a IN (SELECT id, episodes FROM anime) LOOP
        SELECT COUNT(DISTINCT season_id) INTO v_num_season
        FROM anime_studio
        WHERE anime_id = a.id;

        IF v_num_season > 0 THEN 
            episode_count := CEIL(a.episodes / v_num_season);

            FOR s IN (SELECT DISTINCT season_id FROM anime_studio WHERE anime_id = a.id) LOOP
                v_season_id := s.season_id;
                FOR i IN 1..episode_count LOOP
                    INSERT INTO episode (season_id, episode_number, link)
                    VALUES (v_season_id, i, 'https://youtu.be/fQ6PRbh-ntM');
                END LOOP;
            END LOOP;
        END IF;
    END LOOP;
END $$;






