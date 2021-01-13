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
pub struct NewToken<'a> {
    pub token_uuid: &'a str,
    pub user_id: &'a i32,
    pub expiration: &'a i64,
}