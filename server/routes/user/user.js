const express = require('express')
const router = express.Router()
const passport = require('passport')
const { Users: User, Recipes, StepsLists, IngredientsLists, Steps, RecipeIngredients } = require('../../models')
const asyncMiddleware = require('../../utils/asyncMiddleware') 
const asyncForEach = require('../../utils/asyncForEach') 
const areUserInputsValid = require('../../utils/validation/userValidation')
const areRecipeInputsValid = require('../../utils/validation/recipeValidation')


router.get('/recipes', asyncMiddleware( async (req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.status(401).json({
      isAuth: false,
      message: 'User not authenticated, can\'t get recipes.'
    })
  }
  let recipes = await getUserRecipes(req.user)

  return res.status(200).json({ 
    message : `${req.user.username} recipes`,
    recipes: recipes
  })
}))

router.get('/isAuth', (req, res) => {
  if(req.isAuthenticated()) {
      res.status(200).json({
        isAuth: true, 
        message: 'User is authenticated.',
        username: req.user.username
    })
  } else {
      res.status(401).json({
        isAuth: false,
        message: 'User not authenticated'
    })
  }
}) 

router.post('/logout', (req, res) => {
  req.logout()
  res.status(200).json({
    success: true,
    message: 'Logout succeful'
  })
})

router.post('/register', asyncMiddleware( async(req, res, next) => {
  const errMsg = `Validation of the Register form inputs failed.`
  const { email, username, password, passwordConf } = req.body
  
  const isUserDataValid = await isUserCredentialValid(email, username, password, passwordConf)
  if (!isUserDataValid) {
    return res.status(400).json({ 
      message : errMsg,
    })
  }

  const user = await createNewUser(email, username, password)
  return res.status(200).json({ 
    message : `${user.username}`,
  })
}))

router.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }

    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.status(401).json({ 
        message : 'Invalide email or passwword' 
      })
    }
 
    req.login(user, async loginErr => {
      if (loginErr) {
        return next(loginErr)
      }
      
      // let recipes = await getUserRecipes(user)

      return res.status(200).json({ 
        message : 'Authentication succeeded',
        username: user.username,
      })
    })
  })(req, res, next)
})

router.post('/recipes', asyncMiddleware( async(req, res, next) => {
  const errMsg = `Validation of the recipe form inputs failed.`
  const recipeData = req.body
  
  console.log(areRecipeInputsValid(recipeData))
 
  // const isRecipeDataVaild = await isUserCredentialValid(email, username, password, passwordConf)
  // if (!isUserDataValid) {
  //   return res.status(400).json({ 
  //     message : errMsg,
  //   })
  // }

  // const user = await createNewUser(email, username, password)
  // return res.status(200).json({ 
  //   message : `${user.username}`,
  // })
  return res.status(200).json({recipeData: recipeData})
}))

function trimRecipeData(recipeData) {
    
}

async function isUserCredentialValid(email, username, password, passwordConf) {
  return areUserInputsValid(email, username, password, passwordConf)
      && !await areCredentialAlredyUsed(email, username)
}

async function areCredentialAlredyUsed(email, username) {
  return await User.findOne({ where: {email: email } }) != null
      || await User.findOne({ where: {username: username } }) != null
}

async function createNewUser(email, username, password) {
  const newUser = new User({
    email,
    username,
    password
  })

  const hash = await User.hashPassword(password)
  newUser.password = hash
  
  return await newUser.save()
}

async function getUserRecipes(user) {
  let recipes = await Recipes.findAll({
    where: {
      userId: user.userId
    }, 
    include: [StepsLists, IngredientsLists]
  }).catch(e => console.log(e))
  
  return await recipesToJson(recipes) 
}

async function recipesToJson(recipes) {
  let formatedRecipes = []

  await asyncForEach(recipes, async (recipe, i, arr) => {
    let formatedRecipe = recipe.toJson()
    let ingredients = {}
    let steps = {}

    await asyncForEach(recipe.IngredientsLists, async (list, i, arr) => {
      let rawIngredients = await list.getRecipeIngredients()
      ingredients[list.dataValues.title] = rawIngredients.map(ing => ing.toJson())
    })

    await asyncForEach(recipe.StepsLists, async (list, i, arr) => {
      let rawSteps = await list.getSteps() 
      steps[list.dataValues.title] = rawSteps.map(s => s.toJson())
    })

    formatedRecipe.ingredients = ingredients
    formatedRecipe.steps = steps
    formatedRecipes.push(formatedRecipe)
  })  

  return formatedRecipes
}

module.exports = router