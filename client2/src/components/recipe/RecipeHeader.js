import React, { Fragment } from "react"
import prettyMs from "pretty-ms"

import { Row, Col } from "react-bootstrap"

function doShowPreparationTime(time) {
  if (time && time > 0) return true

  return false
}
const RecipeHeader = ({ recipe }) => {
  const isRecipeSelected = recipe !== null && recipe !== undefined
  const recipeImgPlaceholderUrl =
    "https://www.sauceandsound.com/wp-content/uploads/2018/11/empty-plate-fork-knife.jpg"

  let img = ""
  if (isRecipeSelected) {
    img = recipe.recipeImgUrl
    if (!img) img = recipeImgPlaceholderUrl
  }

  function renderStyle(recipeImgUrl) {
    return recipeImgUrl
      ? {
          style: {
            backgroundImage: `url(${recipeImgUrl})`,
          },
        }
      : {}
  }

  return (
    <Row className="recipe-header">
      <Col lg={12}>
        <div className="recipe-header-background" {...renderStyle(img)}></div>
        {!isRecipeSelected ? (
          <h1 className="ma header-title black-title text-center">
            Select a recipe
          </h1>
        ) : (
          <Row>
            <Col lg={2}>
              <img className="recipe-header-img" src={img} />
            </Col>
            <Col lg={10}>
              <h1 className={`header-title`}>{recipe.title}</h1>
              <hr />
              <Row className="recipe-header-info" as="dl">
                {doShowPreparationTime(
                  recipe.recipeInfo.preparationTimeInMs
                ) && (
                  <Col lg={12}>
                    <dt>Preparation Time:</dt>
                    <dd>
                      {prettyMs(recipe.recipeInfo.preparationTimeInMs, {})}
                    </dd>
                  </Col>
                )}
                {doShowPreparationTime(recipe.recipeInfo.cookTimeInMs) && (
                  <Col lg={12}>
                    <dt>Cooking Time:</dt>
                    <dd>{prettyMs(recipe.recipeInfo.cookTimeInMs, {})}</dd>
                  </Col>
                )}
                {recipe.recipeInfo.portions && (
                  <Col lg={12}>
                    <dt>Portions:</dt>
                    <dd>{recipe.recipeInfo.portions}</dd>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default RecipeHeader
