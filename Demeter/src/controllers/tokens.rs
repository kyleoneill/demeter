use uuid::Uuid;
use chrono::Utc;

const SECONDS_IN_DAY: i64 = 86_400;

pub fn generate_token() -> String {
    Uuid::new_v4().to_string()
}

///Returns the current unix time in seconds plus an offset.
///
///The offset is the number of seconds in the number of days given as the function input.
pub fn get_unix_expiration_date(days: i64) -> i64 {
    Utc::now().timestamp() + (SECONDS_IN_DAY * days)
}

pub fn token_expired(expiration_stamp: &i64) -> bool {
    Utc::now().timestamp() > *expiration_stamp
}