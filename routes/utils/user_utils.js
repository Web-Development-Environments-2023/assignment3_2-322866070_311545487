const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into mydb.favorite_recipes values ('${user_id}','${recipe_id}')`);
}

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
    var currentdate = new Date(); 
    var datetime =currentdate.getFullYear()+"-"
                    + (currentdate.getMonth()+1) + "-" 
                    + currentdate.getDate() + " "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    if(user_id==undefined || recipe_id==undefined){
        throw { status: 422, message: "Missing Values" }; 
    }
    else{
        const recipes_id = await DButils.execQuery(`select recipe_id from mydb.watched_recipes where username='${user_id}' AND recipe_id='${recipe_id}'`);
        if(recipes_id.length>0){
            console.log()
            await DButils.execQuery(`UPDATE watched_recipes SET date = '${datetime}' WHERE username = '${user_id}' AND recipe_id='${recipe_id}';`);
        }
        else{
            await DButils.execQuery(`INSERT INTO watched_recipes VALUES ('${user_id}','${recipe_id}','${datetime}')`);
        }
    }
}

async function getWatchedRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from mydb.watched_recipes where username='${user_id}' ORDER BY date DESC`);
    if(recipes_id.length>2){
        const recipes_id_top_3=[];
        recipes_id_top_3.push(recipes_id[0]);
        recipes_id_top_3.push(recipes_id[1]);
        recipes_id_top_3.push(recipes_id[2]);
        return recipes_id_top_3;
    }
    return recipes_id;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.deleteFromFavorite = deleteFromFavorite;

exports.getPersonalRecipes = getPersonalRecipes;
exports.deleteFromPersonal = deleteFromPersonal;

exports.markAsWatched = markAsWatched;
exports.getWatchedRecipes = getWatchedRecipes;
