using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ReactShop.Models;
using ReactShop.Services;
using ReactShop.Services.Interface;

namespace ReactShop.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products = await _productService.GetAll();
            return Ok(products);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetById(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost("ids")]
        public async Task<IActionResult> GetByIds([FromBody] IEnumerable<int> ids)
        {
            var products = await _productService.GetByIds(ids);
            return Ok(products);
        }


    }
}
