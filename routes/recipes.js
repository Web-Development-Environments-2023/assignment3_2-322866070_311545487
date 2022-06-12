var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.post("/searchRecipes", async (req, res) => {
    const query = req.body.query;
    const cuisine = req.body.cuisine;
    const diet = req.body.diet;
    const intolerances = req.body.intolerances;
    const number = req.body.number;
    // res.send("im awesome");
    let recipes = await recipes_utils.searchRecipes(query, cuisine, diet, intolerances, number); 
    let search_res = [];
    for (let i = 0; i < recipes.length; i++)
    {
        let recipe_info = await recipes_utils.getRecipeDetails(recipes[i]);
        recipe_info.recipeId = recipes[i];        
        search_res.push(recipe_info);
    }
    res.status(200).send(search_res);

});


module.exports = router;

