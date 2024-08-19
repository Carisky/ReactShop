using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactShop.Models;
using ReactShop.Services.Interface;

namespace ReactShop.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewservice;

        public ReviewController(IReviewService reviewservice)
        {
            _reviewservice = reviewservice;
        }


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var reviews = await _reviewservice.GetAll();
            return Ok(reviews);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var review = await _reviewservice.GetById(id);
            if (review == null)
            {
                return NotFound();
            }
            return Ok(review);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetListByProductId(int productId)
        {
            var reviews = await _reviewservice.GetListByProductId(productId);
            return Ok(reviews);
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Review review)
        {
            if (ModelState.IsValid)
            {
                await _reviewservice.Add(review);
                return Ok(review);
            }
            return BadRequest(ModelState);
        }
    }
}
