const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into mydb.favorite_recipes values ('${user_id}','${recipe_id}')`);
}

// async function getFavoriteRecipe(user_id, recipe_id){
//     const recipes_id = await DButils.execQuery(`select '${recipe_id}' from mydb.favorite_recipes where user_id='${user_id}'`);
//     return recipes_id;
// }

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select * from mydb.favorite_recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function deleteFromFavorite(user_id, recipe_id){
    await DButils.execQuery(`delete from mydb.favorite_recipes values where user_id='${user_id}' and recipe_id='${recipe_id}'`);
}

async function getPersonalRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select * from mydb.personal_recipes where user_id='${user_id}'`);
    return recipes_id;
}

async function deleteFromPersonal(user_id, recipe_id){
    await DButils.execQuery(`delete from mydb.personal_recipes values where user_id='${user_id}' and recipe_id='${recipe_id}'`);
}



async function markAsWatched(user_id, recipe_id){
    await DButils.execQuery(`INSERT INTO mydb.watched_recipes VALUES ('${user_id}','${recipe_id}')`);
}

async function getWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from mydb.watched_recipes where user_id='${user_id}'`);
    return recipes_id;
}




exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.deleteFromFavorite = deleteFromFavorite;

exports.getPersonalRecipes = getPersonalRecipes;
exports.deleteFromPersonal = deleteFromPersonal;

exports.markAsWatched = markAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;
