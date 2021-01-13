table! {
    recipes (recipe_id) {
        recipe_id -> Nullable<Integer>,
        author_id -> Integer,
        recipe_category -> Text,
        recipe_title -> Text,
        recipe_number_served -> Nullable<Integer>,
        recipe_difficulty -> Nullable<Text>,
        recipe_ingredients -> Text,
        recipe_preparation_steps -> Text,
        recipe_photo_path -> Nullable<Text>,
        recipe_preparation_time -> Nullable<Integer>,
    }
}

table! {
    users (user_id) {
        user_id -> Nullable<Integer>,
        username -> Text,
        hashed_password -> Text,
        salt -> Text,
        created_at -> Bigint,
    }
}

table! {
    tokens (token_id) {
        token_id -> Integer,
        token_uuid -> Text,
        user_id -> Integer,
        expiration -> Bigint,
    }
}

joinable!(recipes -> users (author_id));
joinable!(tokens -> users (user_id));

allow_tables_to_appear_in_same_query!(
    recipes,
    users,
    tokens
);
