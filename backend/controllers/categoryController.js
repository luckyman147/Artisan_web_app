import Category  from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).send('Category not found');
  res.json(category);
};

export const createCategory = async (req, res) => {
  const newCategory = new Category(req.body);
  await newCategory.save();
  res.status(201).json(newCategory);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).send('Category not found');
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).send('Category not found');
  res.json({ message: 'Category deleted' });
};
