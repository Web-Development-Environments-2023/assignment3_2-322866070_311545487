CREATE TABLE [mydb].[family_recipes] (
  [recipe_id] [varchar](50) PRIMARY KEY NOT NULL,
  [recipe_owner] [varchar](45) NOT NULL,
  [occasion] [varchar](45) NOT NULL,
  [ingridients] [varchar](45) NOT NULL,
  [direction] [varchar](45) NOT NULL, --instructions?
  [photo] [varchar](45) NOT NULL,
  FOREIGN KEY (recipe_owner) REFERENCES users(recipe_owner)
) 