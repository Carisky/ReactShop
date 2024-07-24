using Microsoft.AspNetCore.Mvc;
using ReactShop.Models;

namespace ReactShop.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RecommendedProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RecommendedProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult GetRecommendedProducts([FromBody] TagRequest tagRequest)
        {
            if (tagRequest.Tags == null || !tagRequest.Tags.Any())
            {
                return BadRequest("Tags are required.");
            }

            var recommendedProducts = _context.Products
                .Where(product => tagRequest.Tags.Any(tag => product.Tags.Contains(tag)))
                .Take(3)
                .ToList();

            return Ok(recommendedProducts);
        }
    }
}
