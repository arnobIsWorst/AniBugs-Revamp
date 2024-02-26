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



