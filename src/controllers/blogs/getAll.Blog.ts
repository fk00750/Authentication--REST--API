import Blog from "../../models/blog.Model";
import RouteParamsHandler from "../../types/RouteParams.type";

enum ROLE {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

const getAllBlogs: RouteParamsHandler = async (req, res, next) => {
  try {
    // const user = (<any>req).user;

    // filter
    let filter: { author?: string; title?: string } = {};
    if (req.query.author) filter.author = (<any>req.query).author;
    if (req.query.title) filter.title = (<any>req.query).title;

    // // if the user is not an admin or no filter is provided
    // if (user.role !== ROLE.ADMIN && !Object.keys(filter).length) {
    //   filter.author = user.username; // username
    // }

    // find blog
    const blogs = await Blog.find(filter);

    // error
    if (!blogs) return next(new Error("Unable to find blogs"));

    // response
    res.status(200).json({ blogs });
  } catch (error) {
    return next(error);
  }
};

export default getAllBlogs;
