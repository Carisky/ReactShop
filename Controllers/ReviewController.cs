using Microsoft.AspNetCore.Mvc;
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

        [HttpPost("id")]
        public async Task<IActionResult> GetListByProductId([FromBody] int id)
        {
            var reviews = await _reviewservice.GetListByProductId(id);
            return Ok(reviews);
        }
    }
}
