using Microsoft.EntityFrameworkCore;
using ReactShop.Models;
using ReactShop.Services.Interface;

namespace ReactShop.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Review>> GetAll()
        {
            // Retrieve all reviews from the database
            return await _context.Reviews.ToListAsync();
        }

        public async Task<Review> GetById(int id)
        {
            // Find review by ID in the database
            return await _context.Reviews.FindAsync(id);
        }

        public async Task<IEnumerable<Review>> GetListByProductId(int productId)
        {
            // Find reviews by Product ID in the database
            return await _context.Reviews.Where(r => r.ProductId == productId).ToListAsync();
        }

        public async Task<Review> Add(Review review)
        {
            // Add a new review to the database
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<Review> Update(int id, Review updatedReview)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review != null)
            {
                // Update the review with the new values
                review.UserId = updatedReview.UserId;
                review.ProductId = updatedReview.ProductId;
                review.ReviewPlot = updatedReview.ReviewPlot;
                review.Rating = updatedReview.Rating;
                
                _context.Reviews.Update(review);
                await _context.SaveChangesAsync();
            }
            return review;
        }

        public async Task Delete(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review != null)
            {
                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();
            }
        }
    }
}
