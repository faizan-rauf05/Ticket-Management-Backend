import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  city: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
  },
  blog: {
    type: String,
    // required: true,
  },
});

export const BlogModel = mongoose.model("blog", blogSchema);
