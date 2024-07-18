using ReactShop.Models;
using System.Threading.Tasks;

namespace ReactShop.Services.Interface
{
    public interface IOrderService
    {
        Task CreateOrderAsync(Order order);
    }
}