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
        ResourceAccepted
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
        }

        public static DbResult InsertRecipe(Recipe recipe)
        {
            var checkIfRecipeExists = GetRecipeBySlug(recipe.Slug);
            if(checkIfRecipeExists == null)
            {
                var collection = database.GetCollection<BsonDocument>("recipes");
                var serializedRecipe = recipe.ToBsonDocument();
                collection.InsertOne(serializedRecipe);
                return DbResult.ResourceAccepted;
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
    }
}