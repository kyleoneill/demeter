use super::super::schema::tokens;

#[derive(Queryable)]
pub struct Token {
    pub token_id: i32,
    pub token_uuid: String,
    pub user_id: i32,
    pub expiration: i64,
}

#[derive(Insertable)]
#[table_name = "tokens"]
pub struct NewToken {
    pub token_uuid: String,
    pub user_id: i32,
    pub expiration: i64,
}