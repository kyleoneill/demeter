#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
extern crate rocket;
extern crate dotenv;
extern crate chrono;
extern crate rocket_contrib;

use rocket::{get, routes};

mod error;
pub mod db;
#[path = "./controllers/controllers.rs"]pub mod controllers;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/hello/<name>/<age>")]
fn hello(name: String, age: u8) -> String {
    format!("Hello, {} year old named {}!", age, name)
}

fn main() {
    let toml_exists = std::path::Path::new("Rocket.toml").exists();
    match toml_exists {
        true => {
            rocket::ignite()
            .attach(db::Database::fairing())
            .mount("/", routes![index, hello])
            .mount("/api", routes![
                controllers::users::create,
                controllers::users::authenticate
            ])
            .launch();
        }
        false => {
            panic!("No Rocket toml file found, please run 'generate_rocket_toml.py'.")
        }
    }
}
