using ReactShop.Models;

namespace ReactShop.Services.Interface
{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetAll();
        Task<Review> GetById(int id);
        Task<IEnumerable<Review>> GetListByProductId(int id);
        Task<Review> Add(Review review);
        Task<Review> Update(int id, Review review);
        Task Delete(int id);
    }
}
