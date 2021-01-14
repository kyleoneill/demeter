use chrono::prelude::*;

use std::str;

use rocket::{post, get};
use rocket_contrib::json::Json;
use base64::encode;
use rand::Rng;
use sha2::{Sha256, Digest};
use serde::Deserialize;

use crate::{
    db,
    error::Error,
    controllers
};

#[derive(Deserialize)]
pub struct User<'a> {
    username: &'a str,
    password: &'a str
}

impl <'a> User<'a> {
    fn trim(&mut self) {
        self.username = self.username.trim();
        self.password = self.password.trim();
    }
}

fn generate_salt() -> String {
    let random_bytes = rand::thread_rng().gen::<[u8; 32]>();
    encode(random_bytes)
}

fn hash_password(password: &str, salt: &str) -> String {
    let mut password = password.to_owned();
    password.push_str(salt);
    let digest = Sha256::digest(&password.as_bytes());
    //The hash here is raw bytes, they are not guarenteed to be valid UTF-8. The hash has to be encoded to be stored as a string
    //When I want to use the hash just decode it or encode whatever I want to compare it to and compare the encodings instead
    base64::encode(&digest)
}

#[post("/users/create", data = "<new_user>")]
pub fn create(conn: db::Database, mut new_user: Json<User>) -> Result<String, Error> {
    new_user.trim();
    let salt = generate_salt();
    let hashed_password = hash_password(new_user.password, &salt);
    match db::create_user(
        conn.connection(),
        db::models::users::NewUser { 
            username: new_user.username,
            hashed_password: &hashed_password,
            salt: &salt,
            created_at: &Utc::now().timestamp()
        }) {
        Ok(_val) => {
            Ok(format!("Created account with username {}", new_user.username))
        }
        Err(Error::ResourceAlreadyExists) => {
            Err(Error::ResourceAlreadyExists)
        }
        Err(_e) => {
            Err(Error::GenericError)
        }
    }
}

#[post("/users/authenticate", data = "<request_user>")]
pub fn authenticate(conn: db::Database, request_user: Json<User>) -> Result<String, Error> {
    match db::get_user(&conn, &request_user.username) {
        Ok(user) => {
            let hashed_password = hash_password(request_user.password, &user.salt);
            if hashed_password == user.hashed_password {
                let token = db::create_token(&conn, &user.username).expect("Failed to generate new token");
                Ok(token)
            }
            else {
                Err(Error::BadCredentials)
            }
        }
        Err(_e) => {
            Err(Error::NotFound)
        }
    }
}

#[get("/users/check_token?<username>&<request_token>",)]
pub fn check_token(conn: db::Database, username: String, request_token: String) -> Result<Json<bool>, Error> {
    let username = username.as_str();
    let request_token = request_token.as_str();
    match verify_token(&conn, username, request_token) {
        Ok(token_valid) => {
            Ok(Json(token_valid))
        }
        Err(_e) => {
            Err(Error::GenericError)
        }
    }
}

pub fn verify_token(conn: &db::Database, username: &str, request_token: &str) -> Result<bool, Error> {
    match db::get_token(&conn, username) {
        Ok(token) => {
            Ok(token.token_uuid.eq(request_token) && !controllers::tokens::token_expired(&token.expiration))
        }
        Err(_e) => {
            Err(Error::NotFound)
        }
    }
}