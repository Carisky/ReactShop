using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactShop.Models;
using ReactShop.Services.Interface;

namespace ReactShop.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        private readonly IProductService _productService;

        public AdminController(IProductService productService)
        {
            _productService = productService;
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("validation")]
        public IActionResult AdminValidate()
        {
            return Ok();
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("articles")]
        public async Task<IActionResult> AdminArticlesAsync()
        {
            var products = await _productService.GetAll();
            return Ok(products);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("articles")]
        public async Task<IActionResult> CreateArticleAsync([FromForm] Product article, [FromForm] IFormFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (imageFile != null && imageFile.Length > 0)
            {

                var imagePath = Path.Combine("wwwroot/ProductImages", imageFile.FileName);
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                article.ImageUrl = $"/{imageFile.FileName}";
            }

            await _productService.Add(article);
            return CreatedAtAction(nameof(GetArticleByIdAsync), new { id = article.Id }, article);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost]
        public async Task<IActionResult> Post(Product product)
        {
            if (ModelState.IsValid)
            {
                await _productService.Add(product);
                return CreatedAtAction(nameof(_productService.GetById), new { id = product.Id }, product);
            }
            return BadRequest(ModelState);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPut("articles/{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] Product product, IFormFile? imageFile)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (imageFile != null && imageFile.Length > 0)
            {
                // Handle file upload, if needed
                var imagePath = $"wwwroot/ProductImages/{imageFile.FileName}";
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                product.ImageUrl = $"/ProductImages/{imageFile.FileName}";
            }

            try
            {
                await _productService.Update(id, product); // Assuming _productService has an Update method
                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating article: {ex.Message}");
            }
        }
        [Authorize(Policy = "AdminOnly")]
        [HttpGet("articles/{id}")]
        public async Task<IActionResult> GetArticleByIdAsync(int id)
        {
            var article = await _productService.GetById(id);
            if (article == null)
            {
                return NotFound();
            }
            return Ok(article);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("articles/{id}")]
        public async Task<IActionResult> DeleteArticleAsync(int id)
        {
            var article = await _productService.GetById(id);
            if (article == null)
            {
                return NotFound();
            }

            await _productService.Delete(article.Id);
            return NoContent();
        }

        private async Task<bool> ProductExists(int id)
        {
            var product = await _productService.GetById(id);
            return product != null;
        }
    }
}

