using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Demeter.Types
{
    [BsonIgnoreExtraElements]
    public class Recipe
    {
        public string ID { get; set; }
        public string Slug { get; set; }
        public string Name { get; set; }
        public int? PreparationTime { get; set; }
        public int? Servings { get; set; }
        public IEnumerable<Ingredient> Ingredients { get; set; }
        public string Preparation { get; set; }
        public string Instructions { get; set; }
        public RecipeType RecipeType { get; set; }
        public string AuthorID { get; set; }
    }

    public class Ingredient
    {
        public int Amount { get; set; }
        public string Name { get; set; }
        public string AmountType { get; set; }
    }

    public enum RecipeType
    {
        Breakfast,
        Lunch,
        Dinner,
        Dessert,
        Misc
    }
}
