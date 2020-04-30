const express = require("express");
const router = express.Router();
const Character = require("../models/character");
const saveImage = require("../public/javascripts/helper");
const { checkAuthenticated, requireAdmin } = require("../config/auth");

// All character routes
router.get("/", checkAuthenticated, async (request, response) => {
  try {
    const characters = await Character.find();
    response.render("characters/characters", { characters: characters });
  } catch (error) {
    console.log(error);
    response.redirect("/");
  }
});

// New character routes
router.get("/new", requireAdmin, (request, response) => {
  response.render("characters/new", { character: new Character() });
});

// Create edit route
router.get("/edit/:id", requireAdmin, async (request, response) => {
  const character = await Character.findById(request.params.id);
  response.render("characters/edit", { character: character });
});

router.get("/:slug", async (request, response) => {
  const character = await Character.findOne({ slug: request.params.slug });
  if (character == null) response.redirect("/");
  response.render("characters/show", { character: character });
});

// Create character route
router.post(
  "/",
  async (request, response, next) => {
    request.character = new Character();
    next();
  },
  saveCharacterAndRedirect("new")
);

// Edit character route
router.put(
  "/:id",
  async (request, response, next) => {
    request.character = await Character.findById(request.params.id);
    next();
  },
  saveCharacterAndRedirect("edit")
);

// Delete character
router.delete("/:id", requireAdmin, async (request, response) => {
  await Character.findByIdAndDelete(request.params.id);
  response.redirect("/characters");
});

function saveCharacterAndRedirect(path) {
  return async (request, response) => {
    let character = request.character;
    character.name = request.body.name;
    character.title = request.body.title;
    character.description = request.body.description;
    character.condition = request.body.condition;
    character.relationship = request.body.relationship;
    character.markdown = request.body.markdown;
    saveImage(character, request.body.image);
    try {
      character = await character.save();
      response.redirect(`/characters/${character.slug}`);
    } catch (error) {
      console.log(error);
      response.render(`characters/${path}`, { character: character });
    }
  };
}

module.exports = router;
