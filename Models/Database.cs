using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using Demeter.Types;

namespace Demeter.Models
{
    public enum DbResult
    {
        ResourceAlreadyExists,
        ResourceNotFound,
        DatabaseError,
        OperationAccepted
    }

    public static class Database
    {
        static readonly string connectionString = "mongodb://localhost:27017/demeter";
        static MongoClient dbClient;
        static IMongoDatabase database;

        public static void Setup()
        {
            dbClient = new MongoClient(connectionString);
            database = dbClient.GetDatabase("demeter");
            if (database.GetCollection<BsonDocument>("recipes") == null)
                database.CreateCollection("recipes");
            if (database.GetCollection<BsonDocument>("users") == null)
                database.CreateCollection("users");
        }

        // Recipe
        public static DbResult InsertRecipe(Recipe recipe)
        {
            var checkIfRecipeExists = GetRecipeBySlug(recipe.Slug);
            if(checkIfRecipeExists == null)
            {
                var collection = database.GetCollection<BsonDocument>("recipes");
                var serializedRecipe = recipe.ToBsonDocument();
                collection.InsertOne(serializedRecipe);
                return DbResult.OperationAccepted;
            }
            else
            {
                return DbResult.ResourceAlreadyExists;
            }
        }

        public static Recipe GetRecipeBySlug(string recipeSlug)
        {
            var collection = database.GetCollection<BsonDocument>("recipes");
            var filter = Builders<BsonDocument>.Filter.Eq("Slug", recipeSlug);
            var document = collection.Find(filter).FirstOrDefault();
            if(document != null)
            {
                Recipe recipe = BsonSerializer.Deserialize<Recipe>(document);
                return recipe;
            }
            return null;
        }

        public static async Task<List<Recipe>> GetRecipeByType(RecipeType recipeType, int limit)
        {
            var collection = database.GetCollection<BsonDocument>("recipes");
            var filter = Builders<BsonDocument>.Filter.Eq("RecipeType", (int)recipeType);
            List<Recipe> recipes = new();
            await collection.Find(filter).Limit(limit).ForEachAsync(
                document =>
                {
                    var recipe = BsonSerializer.Deserialize<Recipe>(document);
                    recipes.Add(recipe);
                }
            );
            return recipes;
        }

        public static DbResult UpdateRecipe(Recipe recipe)
        {
            var collection = database.GetCollection<BsonDocument>("recipes");
            var filter = Builders<BsonDocument>.Filter.Eq("Slug", recipe.Slug);
            var update = Builders<BsonDocument>.Update;
            var updates = new List<UpdateDefinition<BsonDocument>>();
            updates.Add(update.Set("Name", recipe.Name));
            if (recipe.PreparationTime.HasValue)
                updates.Add(update.Set("PreparationTime", recipe.PreparationTime.Value));
            else
                updates.Add(update.Unset("PreparationTime"));
            if (recipe.Servings.HasValue)
                updates.Add(update.Set("Servings", recipe.Servings.Value));
            else
                updates.Add(update.Unset("Servings"));
            updates.Add(update.Set("Ingredients", recipe.Ingredients));
            updates.Add(update.Set("Preparation", recipe.Preparation));
            updates.Add(update.Set("Instructions", recipe.Instructions));
            updates.Add(update.Set("RecipeType", recipe.RecipeType));
            var updateResult = collection.UpdateOne(filter, update.Combine(updates));
            if (!updateResult.IsAcknowledged)
                return DbResult.DatabaseError;
            else if (updateResult.MatchedCount == 0)
                return DbResult.ResourceNotFound;
            else return DbResult.OperationAccepted;
        }

        public static DbResult DeleteRecipe(string recipeSlug)
        {
            var collection = database.GetCollection<BsonDocument>("recipes");
            var deleteFilter = Builders<BsonDocument>.Filter.Eq("Slug", recipeSlug);
            var deleteResult = collection.DeleteOne(deleteFilter);
            if (!deleteResult.IsAcknowledged)
                return DbResult.DatabaseError;
            else if (deleteResult.DeletedCount == 0)
                return DbResult.ResourceNotFound;
            else
                return DbResult.OperationAccepted;
        }


        // User
        public static DbResult InsertUser(User user)
        {
            var checkIfUserExists = GetUserByUsername(user.Username);
            if (checkIfUserExists == null)
            {
                var collection = database.GetCollection<BsonDocument>("users");
                var serializedUser = user.ToBsonDocument();
                collection.InsertOne(serializedUser);
                return DbResult.OperationAccepted;
            }
            else
                return DbResult.ResourceAlreadyExists;
        }

        public static User GetUserByUsername(string username)
        {
            var collection = database.GetCollection<BsonDocument>("users");
            var filter = Builders<BsonDocument>.Filter.Eq("Username", username);
            var document = collection.Find(filter).FirstOrDefault();
            if (document != null)
            {
                User user = BsonSerializer.Deserialize<User>(document);
                return user;
            }
            return null;
        }

        public static DbResult DeleteUser(string username)
        {
            var collection = database.GetCollection<BsonDocument>("users");
            var deleteFilter = Builders<BsonDocument>.Filter.Eq("Username", username);
            var deleteResult = collection.DeleteOne(deleteFilter);
            if (!deleteResult.IsAcknowledged)
                return DbResult.DatabaseError;
            else if (deleteResult.DeletedCount == 0)
                return DbResult.ResourceNotFound;
            else
                return DbResult.OperationAccepted;
        }

        public static DbResult ChangePassword(string username, string newPassword, string newSalt)
        {
            var collection = database.GetCollection<BsonDocument>("users");
            var filter = Builders<BsonDocument>.Filter.Eq("Username", username);
            var update = Builders<BsonDocument>.Update;
            var updates = new List<UpdateDefinition<BsonDocument>>();
            updates.Add(update.Set("Password", newPassword));
            updates.Add(update.Set("Salt", newSalt));
            var res = collection.UpdateOne(filter, update.Combine(updates));
            if (!res.IsAcknowledged)
                return DbResult.DatabaseError;
            else if (res.MatchedCount == 0)
                return DbResult.ResourceNotFound;
            else
                return DbResult.OperationAccepted;
        }
    }
}