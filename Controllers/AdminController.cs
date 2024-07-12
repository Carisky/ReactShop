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
        [HttpGet("articles")]
        public async Task<IActionResult> AdminArticlesAsync()
        {
            var products = await _productService.GetAllProducts();
            return Ok(products);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpPost("articles")]
        public async Task<IActionResult> CreateArticleAsync(Product article)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productService.AddProduct(article);
            return CreatedAtAction(nameof(GetArticleByIdAsync), new { id = article.Id }, article);
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpGet("articles/{id}")]
        public async Task<IActionResult> GetArticleByIdAsync(int id)
        {
            var article = await _productService.GetProductById(id);
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
            var article = await _productService.GetProductById(id);
            if (article == null)
            {
                return NotFound();
            }

            await _productService.DeleteProduct(article.Id);
            return NoContent();
        }
    }
}

