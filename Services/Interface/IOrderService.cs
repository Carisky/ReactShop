using ReactShop.Models;

namespace ReactShop.Services.Interface
{
    public interface IOrderService
    {
        Task CreateOrderAsync(Order order);
    }
}