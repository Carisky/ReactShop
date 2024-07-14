using ReactShop.Models;

namespace ReactShop.Services.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAll();
        Task<Product> GetById(int id);
        Task<Product> Add(Product product);
        Task<Product> Update(int id, Product product);
        Task Delete(int id);
    }
}
