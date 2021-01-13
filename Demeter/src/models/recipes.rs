use super::super::schema::recipes;

#[derive(Queryable)]
pub struct Recipe {
    pub recipe_id: Option<i32>,
    pub author_id: i32,
    pub recipe_category: String,
    pub recipe_title: String,
    pub recipe_number_served: Option<i32>,
    pub recipe_difficulty: Option<String>,
    pub recipe_ingredients: String,
    pub recipe_preparation_steps: String,
    pub recipe_photo_path: Option<String>,
    pub recipe_preparation_time: Option<i32>    
}

#[derive(Insertable)]
#[table_name = "recipes"]
pub struct NewRecipe<'a> {
    pub author_id: i32,
    pub recipe_category: &'a str,
    pub recipe_title: &'a str,
    pub recipe_number_served: Option<i32>,
    pub recipe_difficulty: Option<&'a str>,
    pub recipe_ingredients: &'a str,
    pub recipe_preparation_steps: &'a str,
    pub recipe_photo_path: Option<&'a str>,
    pub recipe_preparation_time: Option<i32>    
}