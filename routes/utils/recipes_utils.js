const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


// async function getRecipeInformation(recipe_id) {
//     return await axios.get(`${api_domain}/${recipe_id}/information`, {
//         params: {
//             includeNutrition: false,
//             apiKey: process.env.spooncular_apiKey
//         }
//     });
// }




// async function getRecipeDetails(recipe_id) {
//     let recipe_info = await getRecipeInformation(recipe_id);
//     let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

//     return {
//         id: id,
//         title: title,
//         readyInMinutes: readyInMinutes,
//         image: image,
//         popularity: aggregateLikes,
//         vegan: vegan,
//         vegetarian: vegetarian,
//         glutenFree: glutenFree,
        
//     }
// }

async function getRecipeDetails(recipe_id) {
    let res = await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });
    let recipe_info = await parseData(res);
    // let recipe_info = res.data;
    return {
        id: recipe_info.id,
        image: recipe_info.image,
        title: recipe_info.title,
        readyInMinutes: recipe_info.readyInMinutes,
        popularity: recipe_info.aggregateLikes,
        vegan: recipe_info.vegan,
        vegetarian: recipe_info.vegetarian,
        glutenFree: recipe_info.glutenFree,
        servings: recipe_info.servings,
        // ingredients: recipe_info.extendedIngredients,
        instructions: recipe_info.instructions
    }
}

async function searchRecipes(query, cuisine, diet, intolerances, res_num)
{
    let recipes_id_lst = [];
    let res = await axios.get(`${api_domain}/search`,
        {
            params: {
                query: query,
                cuisine: cuisine,
                diet: diet,
                intolerances: intolerances,
                number: res_num,
                instructionsRequired: true,
                apiKey: process.env.spooncular_apiKey
            }
        }
    );
    let recipe_info = await parseData(res);
    // let recipe_info = res.data;
    for (let recipe in recipe_info.results)
    {
        recipes_id_lst.push(recipe_info.results[recipe].id);
    }
    return recipes_id_lst;
};

async function parseData(raw_data)
{
    let promiseRes = await Promise.all([raw_data])
    return promiseRes[0].data;
};


async function getRandomRecipes()
{
    let recipes_id_lst = [];
    let res = await axios.get(`${api_domain}/random`, {
        params: {
            number: 3,
            apiKey: process.env.spooncular_apiKey
        }
    });
    let recipe_info = await getDataFromAnswer(res);
    // let recipe_info = res.data;
    for (let recipe in recipe_info.recipes)
    {
        recipes_id_lst.push(recipe_info.recipes[recipe].id);
    }
    return recipes_id_lst;
    
};


exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipes = searchRecipes;
exports.getRandomRecipes = getRandomRecipes;


