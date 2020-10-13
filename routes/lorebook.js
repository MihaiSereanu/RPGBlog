// Currently don't see a usecase for this, keeping for later?
// const express = require("express");
// const router = express.Router();
// const Lorepiece = require("../models/lorepiece");
// const saveImage = require("../public/javascripts/helper");
// const { checkAuthenticated, requireAdmin } = require("../config/auth");

// // All chronicle routes
// router.get("/", checkAuthenticated, async (request, response) => {
//   const lorepieces = await Lorepiece.find().sort({ createdAt: "desc" });
//   response.render("lorebook/lorebook", { lorepieces: lorepieces });
// });

// // New lorepiece routes
// router.get("/new", requireAdmin, (request, response) => {
//   response.render("lorebook/new", { lorepiece: new Lorepiece() });
// });

// // Create edit route
// router.get("/edit/:id", requireAdmin, async (request, response) => {
//   const lorepiece = await Lorepiece.findById(request.params.id);
//   response.render("lorebook/edit", { lorepiece: lorepiece });
// });

// router.get("/:slug", async (request, response) => {
//   const lorepiece = await Lorepiece.findOne({ slug: request.params.slug });
//   if (lorepiece == null) response.redirect("/");
//   response.render("lorebook/show", { lorepiece: lorepiece });
// });

// // Create lorepiece route
// router.post(
//   "/",
//   async (request, response, next) => {
//     request.lorepiece = new Lorepiece();
//     next();
//   },
//   savelorepieceAndRedirect("new")
// );

// router.put(
//   "/:id",
//   async (request, response, next) => {
//     request.lorepiece = await Lorepiece.findById(request.params.id);
//     next();
//   },
//   savelorepieceAndRedirect("edit")
// );

// // Delete lorepiece
// router.delete("/:id", requireAdmin, async (request, response) => {
//   await Lorepiece.findByIdAndDelete(request.params.id);
//   response.redirect("/lorebook");
// });

// function savelorepieceAndRedirect(path) {
//   return async (request, response) => {
//     let lorepiece = request.lorepiece;
//     lorepiece.title = request.body.title;
//     lorepiece.description = request.body.description;
//     lorepiece.markdown = request.body.markdown;
//     saveImage(lorepiece, request.body.image);
//     try {
//       lorepiece = await lorepiece.save();
//       response.redirect(`/lorebook/${lorepiece.slug}`);
//     } catch (error) {
//       console.log(error);
//       response.render(`lorebook/${path}`, { lorepiece: lorepiece });
//     }
//   };
// }

// module.exports = router;
