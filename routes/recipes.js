var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

// router.get("/", (req, res) => res.send("im here"));

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    let favorite=false;
    let watched=false;
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      let watched_list = await recipes_utils.getWatchedRecipeById(user_id,req.params.recipeId);
      if(watched_list.length>0){watched=true;}
      let favorite_list = await recipes_utils.getFavoriteRecipesById(user_id,req.params.recipeId);
      if(favorite_list.length>0){favorite=true;}
    }
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    recipe['watched']=watched; //not sure if 'watched' or watched in key
    recipe['favorite']=favorite;//not sure if 'favorite' or favorite in key
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
    // let numInt = parseInt(req.body.number);
    // console.log("")
    const number = req.body.amount;
    // res.send("im awesome");
    let recipes = await recipes_utils.searchRecipes(query, cuisine, diet, intolerances, number); 
    let search_res = [];
    for (let i = 0; i < recipes.length; i++)
    {
        let recipe_info = await recipes_utils.getRecipeDetails(recipes[i]);
        recipe_info.recipeId = recipes[i];
        let favorite=false;
        let watched=false;
        if (req.session && req.session.user_id) {
          const user_id = req.session.user_id;
          let watched_list = await recipes_utils.getWatchedRecipeById(user_id,recipes[i]);
          if(watched_list.length>0){watched=true;}
          let favorite_list = await recipes_utils.getFavoriteRecipesById(user_id,recipes[i]);
          if(favorite_list.length>0){favorite=true;}
        }
        recipe_info['watched']=watched;//not sure if 'watched' or watched in key
        recipe_info['favorite']=favorite;//not sure if 'favorite' or favorite in key
        search_res.push(recipe_info);
    }
    res.status(200).send(search_res);

});

router.post("/randomRecipes", async function (req, res) {
  let recipes = await recipes_utils.getRandomRecipes();
  let random_lst = [];
  for (let i = 0; i < recipes.length; i++)
  {
      let recipe_info = await recipes_utils.getRecipeDetails(recipes[i], true);
      let favorite=false;
      let watched=false;
      if (req.session && req.session.user_id) {
        const user_id = req.session.user_id;
        let watched_list = await recipes_utils.getWatchedRecipeById(user_id,recipes[i]);
        if(watched_list.length>0){watched=true;}
        // let favorite_list = await recipes_utils.getFavoriteRecipesById(user_id,recipes[i]);
        // if(favorite_list.length>0){favorite=true;}
      }
      recipe_info['watched']=watched;//not sure if 'watched' or watched in key
      // recipe_info['favorite']=favorite;//not sure if 'favorite' or favorite in key
      random_lst.push(recipe_info);
  }
  res.status(200).send(random_lst);
});

/**
 * This path returns a full details of a recipe by its id
 */
 router.get("/family", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getFamilyRecipes();
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

