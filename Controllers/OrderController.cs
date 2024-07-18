using Microsoft.AspNetCore.Mvc;
using ReactShop.Models;
using ReactShop.Services.Interface;
using System.Linq;
using System.Threading.Tasks;

namespace ReactShop.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IOrderService _orderService;

        public OrderController(IProductService productService, IOrderService orderService)
        {
            _productService = productService;
            _orderService = orderService;
        }

        [HttpPost("CheckStock")]
        public async Task<IActionResult> CheckStock([FromBody] CartItem[] cartItems)
        {
            decimal totalPrice = 0;

            foreach (var item in cartItems)
            {
                var product = await _productService.GetById(item.ProductId);
                if (product == null || product.Amount < item.Quantity)
                {
                    return BadRequest($"Insufficient stock for product ID {item.ProductId}");
                }

                totalPrice += product.Price * item.Quantity;
            }

            return Ok(new { TotalPrice = totalPrice });
        }

        [HttpPost("CreateOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto orderCreateDto)
        {
            var order = new Order
            {
                Fullname = orderCreateDto.Fullname,
                Address = orderCreateDto.Address,
                Items = orderCreateDto.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };

            foreach (var item in order.Items)
            {
                var product = await _productService.GetById(item.ProductId);
                if (product == null || product.Amount < item.Quantity)
                {
                    return BadRequest($"Insufficient stock for product ID {item.ProductId}");
                }
            }

            await _orderService.CreateOrderAsync(order);
            return Ok(order);
        }
    }
}
