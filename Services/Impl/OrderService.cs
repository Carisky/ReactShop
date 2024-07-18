using Microsoft.EntityFrameworkCore;
using ReactShop.Models;
using ReactShop.Services.Interface;

namespace ReactShop.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateOrderAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }
        
    }
}