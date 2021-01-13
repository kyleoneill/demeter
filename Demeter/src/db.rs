use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

use rocket_contrib::database;

#[path = "./models/models.rs"]pub mod models;
#[path = "schema.rs"]pub mod schema;
use crate::{controllers, error::Error};

#[database("database")]
pub struct Database(diesel::SqliteConnection);

impl Database {
    pub fn connection(&self) -> &diesel::SqliteConnection {
        &self.0
    }
}

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

pub fn create_user(conn: &SqliteConnection, new_user: models::users::NewUser) -> Result<usize, Error> {
    use schema::users;
    let user_check =  users::table.filter(users::username.eq(new_user.username)).load::<models::users::User>(conn).expect("Error loading users");
    if user_check.len() > 0 {
        return Err(Error::ResourceAlreadyExists);
    }
    else {
        let res = diesel::insert_into(users::table)
            .values(&new_user)
            .execute(conn)
            .expect("Failed to save new user");
        Ok(res)
    }
}

pub fn get_user(conn: &SqliteConnection, username: &str) -> Result<models::users::User, Error> {
    use schema::users;
    let mut users = users::table.filter(users::username.eq(username)).load::<models::users::User>(conn).expect("Error loading users");
    if users.len() == 1 {
        Ok(users.pop().unwrap())
    }
    else {
        Err(Error::NotFound)
    }
}

pub fn get_token(conn: &SqliteConnection, username: &str) -> Result<models::tokens::Token, Error> {
    use schema::tokens;
    let user = get_user(conn, username).expect("Failed to find user");
    let mut tokens = tokens::table.filter(tokens::user_id.eq(user.user_id.unwrap())).load::<models::tokens::Token>(conn).expect("Error loading tokens");
    if tokens.len() == 1 {
        Ok(tokens.pop().unwrap())
    }
    else {
        Err(Error::NotFound)
    }
}

pub fn create_token(conn: &SqliteConnection, username: &str) -> Result<String, Error> {
    use schema::tokens;
    let user = get_user(conn, username).expect("Failed to find user");
    diesel::delete(tokens::table.filter(tokens::user_id.eq(user.user_id.unwrap()))).execute(conn).expect("Error deleting old token");
    let token_uuid = controllers::tokens::generate_token();
    let new_token = models::tokens::NewToken {
        token_uuid: &token_uuid,
        user_id: &user.user_id.unwrap(),
        expiration: &controllers::tokens::get_unix_expiration_date(10)
    };
    let _res = diesel::insert_into(tokens::table)
        .values(new_token)
        .execute(conn)
        .expect("Failed to save new token");
    Ok(token_uuid)
}

pub fn is_token_valid(conn: &SqliteConnection, token_uuid: &str, username: &str) -> Result<bool, Error> {
    let token = get_token(conn, username).expect("Failed to load token");
    Ok(
        token.token_uuid.eq(token_uuid) && !controllers::tokens::token_expired(&token.expiration)
    )
}