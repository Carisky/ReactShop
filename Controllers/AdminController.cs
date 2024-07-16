using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ReactShop.Models;
using ReactShop.Services.Interface;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
                // Save the image file to a location and get the URL
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
    }
}

