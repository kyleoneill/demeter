use uuid::Uuid;
use chrono::Utc;

use crate::db::models::tokens::{Token, NewToken};

const SECONDS_IN_DAY: i64 = 86_400;

pub fn create_new_token(user_id: i32) -> NewToken {
    NewToken {
        token_uuid: new_uuid(),
        user_id,
        expiration: get_unix_expiration_date(10)
    }
}

fn new_uuid() -> String {
    Uuid::new_v4().to_string()
}

///Returns the current unix time in seconds plus an offset.
///
///The offset is the number of seconds in the number of days given as the function input.
fn get_unix_expiration_date(days: i64) -> i64 {
    Utc::now().timestamp() + (SECONDS_IN_DAY * days)
}

fn token_expired(expiration_stamp: &i64) -> bool {
    Utc::now().timestamp() > *expiration_stamp
}

pub fn is_token_valid(token: &Token, request_token: &str) -> bool {
    token.token_uuid.eq(request_token) && !token_expired(&token.expiration)
}