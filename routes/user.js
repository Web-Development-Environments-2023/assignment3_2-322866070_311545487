var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    //DButils.execQuery("SELECT user_id FROM users").then((users) => {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      //if (users.find((x) => x.user_id === req.session.user_id)) {
      if (users.find((x) => x.username === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    //res.sendStatus(401);
    next();//cookie not working- uncomment the line above and delete this line
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    // res.status(200).send(recipes_id_array[0]);
    let results = [];
    for (let i = 0; i < recipes_id_array.length; i++)
    {
        let recipe_info = await recipe_utils.getRecipeDetails(recipes_id_array[i]);
        recipe_info.recipeId = recipes_id_array[i];
        results.push(recipe_info);
    }
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});



/**
 * This path gets body with recipeId and save this recipe in the watched list of the logged-in user
 */
 router.post('/watched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipe_id;
    await user_utils.markAsWatched(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as watched");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the watched recipes that were saved by the logged-in user
 */
router.get('/watched', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getWatchedRecipes(user_id);
    const results = recipes_id;
    //let recipes_id_array = [];
    //recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    //const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path returns the 3 last watched recipes that were saved by the logged-in user
 */
router.get('/watched3', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getWatchedRecipes3(user_id);
    const results = recipes_id;
    //let recipes_id_array = [];
    //recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    //const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipe details and save this recipe in the personal recipes of the logged-in user
 */
router.post('/personal', async (req,res,next) => {
  try{
    //const user_id = req.session.user_id;
    const user_id='shahardc4'; //cookie not working- uncomment the line above and delete this line
    //const recipes=await user_utils.getPersonalRecipes(req.session.user_id);
    const recipes=await user_utils.getPersonalRecipes('shahardc4');//cookie not working- uncomment the line above and delete this line
    const recipe_id = recipes.length;
    const picture = req.body.picture;
    const name = req.body.name;
    const time_to_prepare = req.body.time_to_prepare;
    const title = req.body.title;
    const vegeterian = req.body.vegeterian;
    const ingridients = req.body.ingridients;
    const instructions = req.body.instructions;
    const number_of_servings = req.body.number_of_servings;
    const glutenFree = req.body.glutenFree;
    await user_utils.addPersonalRecipe(user_id,recipe_id,picture,name,time_to_prepare,title,vegeterian,ingridients,instructions,number_of_servings,glutenFree);

    res.status(200).send("The Personal Recipe was successfully saved");
    } catch(error){
      res.status(409).send("The Recipe Already Exists");
  }
})

/**
 * This path returns the 3 last watched recipes that were saved by the logged-in user
 */
 router.get('/personal', async (req,res,next) => {
  try{
    //const user_id = req.session.user_id;
    const user_id='shahardc4';//cookie not working- uncomment the line above and delete this line
    const recipes_id = await user_utils.getPersonalRecipes(user_id);
    const results = recipes_id;
    //let recipes_id_array = [];
    //recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    //const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


module.exports = router;
