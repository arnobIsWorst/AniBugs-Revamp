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
