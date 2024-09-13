import Review from '../models/Review.js';

export const  getAllReviews = async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.find({ productId: req.params.id }).populate('clientId', 'firstname lastname'); 

    if (!review || review.length === 0) {
      return res.status(404).send('Review not found');
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createReview = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if the user has already submitted a review for this product
    const existingReview = await Review.findOne({ userId, productId });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this product.' });
    }

    // If no existing review, create a new review
    const newReview = new Review(req.body);
    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the review.', error });
  }
};

export const  updateReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!review) return res.status(404).send('Review not found');
  res.json(review);
};

export const  deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).send('Review not found');
  res.json({ message: 'Review deleted' });
};
