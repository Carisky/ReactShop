using ReactShop.Models;
using ReactShop.Services.Interface;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactShop.Services
{
    public class ReviewService : IReviewService
    {
        // In-memory storage for reviews
        private readonly List<Review> _reviews = new List<Review>();

        public async Task<IEnumerable<Review>> GetAll()
        {
            // Return all reviews
            return await Task.FromResult(_reviews);
        }

        public async Task<Review> GetById(int id)
        {
            // Find review by ID
            var review = _reviews.FirstOrDefault(r => r.Id == id);
            return await Task.FromResult(review);
        }

        public async Task<IEnumerable<Review>> GetListByProductId(int productId)
        {
            // Find reviews by Product ID
            var reviews = _reviews.Where(r => r.ProductId == productId);
            return await Task.FromResult(reviews);
        }

        public async Task<Review> Add(Review review)
        {
            // Add a new review
            review.Id = _reviews.Any() ? _reviews.Max(r => r.Id) + 1 : 1; // Set ID for new review
            _reviews.Add(review);
            return await Task.FromResult(review);
        }

        public async Task<Review> Update(int id, Review updatedReview)
        {
            // Update an existing review
            var review = _reviews.FirstOrDefault(r => r.Id == id);
            if (review != null)
            {
                review.UserId = updatedReview.UserId;
                review.ProductId = updatedReview.ProductId;
                review.ReviewPlot = updatedReview.ReviewPlot;
                review.Rating = updatedReview.Rating;
            }
            return await Task.FromResult(review);
        }

        public async Task Delete(int id)
        {
            // Remove a review by ID
            var review = _reviews.FirstOrDefault(r => r.Id == id);
            if (review != null)
            {
                _reviews.Remove(review);
            }
            await Task.CompletedTask;
        }
    }
}
