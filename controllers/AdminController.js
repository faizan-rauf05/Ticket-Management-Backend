import { UserModel } from "../models/userModel.js";
import { categoryModel } from "../models/categoryModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Create Categories

export const createCategory = async (req, res) => {
  const { categoryName, description } = req.body;
  console.log(categoryName, description)

  try {
    const categoryExist = await categoryModel.findOne({ categoryName });

    if (categoryExist) {
      return res.status(400).json({ success: false, error: "Category already exists" });
    }

    const newCategory = new categoryModel({
      categoryName,
      description,
    });

    await newCategory.save();
    res.status(200).json({ success: true, message: "Category added successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Fetch All Categories

export const fetchAllCategories = async (req, res) => {
  try {
    const allCatrgories = await categoryModel.find();
    res.status(200).json(allCatrgories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};
