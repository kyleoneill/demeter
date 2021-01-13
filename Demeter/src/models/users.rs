use super::super::schema::users;

#[derive(Queryable)]
pub struct User {
    pub user_id: Option<i32>,
    pub username: String,
    pub hashed_password: String,
    pub salt: String,
    pub created_at: i64,
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub username: &'a str,
    pub hashed_password: &'a str,
    pub salt: &'a str,
    pub created_at: &'a i64
}