import { Schema, model } from "mongoose";

const BlogSchema = new Schema({
  author: {
    type: String,
    required: [true, "Please provide author name"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Please provide blog title"],
  },
  subtitle: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const Blog = model("Blogs", BlogSchema);

export default Blog;
