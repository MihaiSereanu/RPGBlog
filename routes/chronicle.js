const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const saveImage = require("../public/javascripts/helper");
const { checkAuthenticated, requireAdmin } = require("../config/auth");

// All chronicle routes
router.get("/", checkAuthenticated, async (request, response) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  response.render("chronicle/chronicle", { articles: articles });
});

// New article routes
router.get("/new", requireAdmin, async (request, response) => {
  response.render("chronicle/new", { article: new Article() });
});

// Create edit route
router.get("/edit/:id", requireAdmin, async (request, response) => {
  const article = await Article.findById(request.params.id);
  response.render("chronicle/edit", { article: article });
});

router.get("/:slug", async (request, response) => {
  const article = await Article.findOne({ slug: request.params.slug });
  if (article == null) response.redirect("../chronicle");
  response.render("chronicle/show", { article: article });
});

// Create article route
router.post(
  "/",
  async (request, response, next) => {
    request.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  async (request, response, next) => {
    request.article = await Article.findById(request.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

// Delete article
router.delete("/:id", requireAdmin, async (request, response) => {
  await Article.findByIdAndDelete(request.params.id);
  response.redirect("/chronicle");
});

function saveArticleAndRedirect(path) {
  return async (request, response) => {
    let article = request.article;
    article.title = request.body.title;
    article.description = request.body.description;
    article.markdown = request.body.markdown;
    saveImage(article, request.body.image);
    try {
      article = await article.save();
      response.redirect(`/chronicle/${article.slug}`);
    } catch (error) {
      console.log(error);
      response.render(`chronicle/${path}`, { article: article });
    }
  };
}

module.exports = router;
