using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Demeter.Types;
using Demeter.Models;

namespace Demeter.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;

        public RecipeController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Get([FromQuery(Name = "slug")]string slug)
        {
            if(slug == null)
            {
                return BadRequest("Query parameter 'slug' is required.");
            }
            Recipe recipe = Database.GetRecipeBySlug(slug);
            if(recipe != null)
            {
                return Ok(recipe);
            }
            return NotFound($"No recipe found with slug '{slug}'.");
        }

        [HttpGet]
        [Route("/recipe/type")]
        public async Task<IActionResult> GetAsync([FromQuery(Name = "recipe-type")] int? recipeType=null, [FromQuery(Name = "limit")] int? limit=5)
        {
            if(recipeType == null)
            {
                return BadRequest("Query parameter 'recipe-type' is required.");
            }
            if(limit < 1 || limit > 25)
            {
                return BadRequest("Query parameter 'limit' must be between 1 and 25.");
            }
            List<Recipe> recipes = await Database.GetRecipeByType((RecipeType)recipeType, (int)limit);
            if (recipes.Count > 0)
            {
                return Ok(recipes);
            }
            return NotFound("No recipe found for the given recipe type.");
        }

        [HttpPost]
        public IActionResult Post(Recipe recipe)
        {
            var result = Database.InsertRecipe(recipe);
            switch(result)
            {
                case DbResult.ResourceAccepted:
                    return Accepted();
                case DbResult.ResourceAlreadyExists:
                    return Conflict($"A recipe with slug '{recipe.Slug}' already exists.");
                default:
                    return StatusCode(500);
            }
        }
    }
}
