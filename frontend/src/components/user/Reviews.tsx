import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Rating,
  Card,
  CardContent,
  Grid,
  Container,
  Box,
} from "@mui/material";
import { addReviews, getReviewsById } from "../../apis/action";
import { useAppSelector } from "../../stores/storeHooks";
import { RootState } from "../../stores/store";
import { ReviewsData } from "../../apis/interfaces";

interface ReviewsProps {
  productId: string;
  onRatingUpdate: (averageRating: number) => void;
  onUserLength: (userLength: number) => void; // Corrected prop name
}

const Reviews: React.FC<ReviewsProps> = ({ productId, onRatingUpdate, onUserLength }) => {
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | null>(4);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewsData[]>([]);

  const clientId = useAppSelector((state: RootState) => state.user.userInfos.id);

  useEffect(() => {
    async function fetchReviewsById() {
      try {
        const response = await getReviewsById(productId);
        if (Array.isArray(response)) {
          setReviews(response);
          console.log(response.length, "tttlenght");

          // Calculate the average rating and update it in the parent component
          const averageRating =
            response.reduce((sum, review) => sum + review.rating, 0) /
            response.length;
          onRatingUpdate(averageRating);

          const userLength = response.length;
          onUserLength(userLength); 
        } else {
          setReviews([]);
          onRatingUpdate(0); 
        }
      } catch (err) {
        setError("Failed to load reviews.");
      }
    }
    fetchReviewsById();
  }, [productId, onRatingUpdate, onUserLength]); 

  const handleSubmit = async () => {
    if (rating === null) {
      setError("Please provide a rating.");
      return;
    }
    try {
      const response = await addReviews(productId, clientId!, comment, rating);
      if (response) {
        setSuccess(true);
        setComment("");
        setRating(4);

        const updatedReviews = await getReviewsById(productId);
        if (Array.isArray(updatedReviews)) {
          setReviews(updatedReviews);
          const averageRating =
            updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
            updatedReviews.length;
          onRatingUpdate(averageRating);

          const userLength = updatedReviews.length;
          onUserLength(userLength); 
        }
      }
    } catch (err) {
      setError("Failed to add review.");
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Reviews
      </Typography>

      {reviews.length > 0 ? (
        <Grid container spacing={2}>
          {reviews.map((review) => (
            <Grid item xs={12} sm={6} md={4} key={review._id}>
              <Card
                variant="outlined"
                sx={{
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </Typography>
                    <Rating
                      value={review.rating as number}
                      readOnly
                      size="small"
                    />
                  </Box>

                  <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
                    {review.clientId.firstname} {review.clientId.lastname}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    {review.comment}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No reviews yet. Be the first to review!</Typography>
      )}

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add a Review
        </Typography>
        <Rating
          name="rating"
          value={rating}
          onChange={(_, newValue) => setRating(newValue as number)}
          precision={0.5}
          size="large"
        />
        <TextField
          label="Comment"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{marginBottom : 10}}>
          Submit
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Review added successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Reviews;
