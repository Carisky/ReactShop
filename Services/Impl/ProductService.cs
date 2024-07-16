using Microsoft.EntityFrameworkCore;
using ReactShop.Models;
using ReactShop.Services.Interface;

namespace ReactShop.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product> GetById(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        public async Task<IEnumerable<Product>> GetByIds(IEnumerable<int> ids) // Implementation of the new method
        {
            return await _context.Products.Where(p => ids.Contains(p.Id)).ToListAsync();
        }

        public async Task<Product> Add(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> Update(int id, Product product)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct != null)
            {
                existingProduct.Name = product.Name;
                existingProduct.Price = product.Price;
                await _context.SaveChangesAsync();
            }
            return existingProduct;
        }

        public async Task Delete(int id)
        {
            var productToRemove = await _context.Products.FindAsync(id);
            if (productToRemove != null)
            {
                _context.Products.Remove(productToRemove);
                await _context.SaveChangesAsync();
            }
        }
    }
}
