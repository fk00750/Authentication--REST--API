import Blog from "../../models/blog.Model";
import RouteParamsHandler from "../../types/RouteParams.type";

enum ROLE {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

const deleteBlog: RouteParamsHandler = async (req, res, next) => {
  try {
    const user = (<any>req).user;

    const blog = await Blog.findOne({ _id: req.params.id });

    if (!blog) return next(new Error("Blog is not found"));

    if (user.role === ROLE.ADMIN || user.username === blog.author)
      await Blog.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({ message: "Blog is deleted" });
  } catch (error) {
    return next(error);
  }
};

export default deleteBlog;
