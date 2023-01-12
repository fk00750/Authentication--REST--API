import Joi from "joi";
import Blog from "../../models/blog.Model";
import RouteParamsHandler from "../../types/RouteParams.type";

const updateBlog: RouteParamsHandler = async (req, res, next) => {
  try {
    // joi validation

    const BlogValidationSchema = Joi.object({
      author: Joi.string(),
      title: Joi.string(),
      subtitle: Joi.string(),
      content: Joi.string(),
      tags: Joi.array(),
    });

    const { error } = BlogValidationSchema.validate(req.body);

    if (error) return next(error);

    // update blog
    try {
      const { id } = req.params;
      const { author, title, subtitle, content, tags } = req.body;

      const blog = await Blog.findOneAndUpdate(
        { _id: id },
        { author, title, subtitle, content, tags }
      );

      // error
      if (!blog) return next(new Error("Blog is not found"));

      res.status(200).json({ blog });
    } catch (error) {}
  } catch (error) {
    return next(error);
  }
};

export default updateBlog;
