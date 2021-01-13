CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(25) NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

CREATE TABLE recipes (
    recipe_id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    recipe_category TEXT NOT NULL,
    recipe_title VARCHAR(50) NOT NULL,
    recipe_number_served INTEGER,
    recipe_difficulty VARCHAR(25),
    recipe_ingredients TEXT NOT NULL,
    recipe_preparation_steps TEXT NOT NULL,
    recipe_photo_path TEXT,
    recipe_preparation_time INTEGER,
    FOREIGN KEY(author_id) REFERENCES users(user_id)
);

CREATE TABLE tokens (
    token_id INTEGER NOT NULL PRIMARY KEY,
    token_uuid TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    expiration BIGINT NOT NULL
)