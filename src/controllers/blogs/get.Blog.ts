import Blog from "../../models/blog.Model";
import RouteParamsHandler from "../../types/RouteParams.type";

const getBlog: RouteParamsHandler = async (req, res, next) => {
  try {
    // find one blog
    const { id } = req.params;

    const blog = await Blog.findOne({ _id: id });

    // error 
    // ! refactor this duplicate code
    if (!blog) return next(new Error("Blog is not found"));

    res.status(200).json({ blog });
  } catch (error) {
    return next(error);
  }
};

export default getBlog;
