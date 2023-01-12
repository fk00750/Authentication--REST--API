import express from "express";
import passport from "passport";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
} from "../../controllers";

const BlogRouter = express.Router();

BlogRouter.post(
  "/create-blog",
  passport.authenticate("jwt-refresh", { session: false }),
  createBlog
) // create blog
  .patch(
    "/update-blog/:id",
    passport.authenticate("jwt-access", { session: false }),
    updateBlog
  ) // update blog
  .get("/get-blog/:id", getBlog) // get single blog
  .get(
    "/get-all-blogs",
    passport.authenticate("jwt-refresh", { session: false }),
    getAllBlogs
  ) // get all blogs
  .delete(
    "/delete-blog/:id",
    passport.authenticate("jwt-access", { session: false }),
    deleteBlog
  ); // delete blog

export default BlogRouter;
