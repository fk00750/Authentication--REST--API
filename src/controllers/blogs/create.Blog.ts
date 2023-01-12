import Joi from "joi";
import Blog from "../../models/blog.Model";
import RouteParamsHandler from "../../types/RouteParams.type";

const createBlog: RouteParamsHandler = async (req, res, next) => {
  try {
    // Validate Body data
    const BlogValidationSchema = Joi.object({
      title: Joi.string().required(),
      subtitle: Joi.string(),
      content: Joi.string().required(),
      tags: Joi.array(),
    });

    const { error } = BlogValidationSchema.validate(req.body);

    if (error) return next(error);

    // save the blog
    try {
      // destructing values - optional will be ignored if they are not present
      const { title, subtitle, content, tags } = req.body;
      const { username } = (<any>req).user;

      const blog = new Blog({
        author: username,
        title,
        subtitle,
        content,
        tags,
      });

      const newBlog = await blog.save();

      res.status(201).json({
        message: "Blog Created Successfully",
        Blog: newBlog,
      });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    return next(error);
  }
};

export default createBlog;
