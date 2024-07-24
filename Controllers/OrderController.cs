using Microsoft.AspNetCore.Mvc;
using ReactShop.Models;
using ReactShop.Services.Interface;
using System.Text;

namespace ReactShop.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IOrderService _orderService;
        private readonly ICustomEmailSender _emailSender;

        public OrderController(IProductService productService, IOrderService orderService, ICustomEmailSender emailSender)
        {
            _productService = productService;
            _orderService = orderService;
            _emailSender = emailSender;
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
                Email = orderCreateDto.Email,
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

            
            var orderDetails = new StringBuilder();
            foreach (var item in order.Items)
            {
                var product = await _productService.GetById(item.ProductId);
                if (product == null || product.Amount < item.Quantity)
                {
                    return BadRequest($"Insufficient stock for product ID {item.ProductId}");
                }
                product.Amount -= item.Quantity; 
                await _productService.Update(product.Id,product); 
                orderDetails.AppendLine($"{product.Name} - Quantity: {item.Quantity}, Price: {product.Price * item.Quantity:C}");
            }

            
            await _emailSender.SendOrderConfirmationEmailAsync(orderCreateDto.Email, order.Fullname, orderDetails.ToString());

            return Ok(order);
        }
    }
}
