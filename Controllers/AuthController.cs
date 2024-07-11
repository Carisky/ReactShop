using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ReactShop.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ReactShop.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLogin userLogin)
        {
            // Replace with your user validation logic
            if (userLogin.Username == "test" && userLogin.Password == "password")
            {
                // Example: Fetch user role from database or any logic
                string role = GetUserRoleFromDatabase(userLogin.Username);

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("my-32-character-ultra-secure-and-ultra-long-secret");
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, userLogin.Username),
                        new Claim(ClaimTypes.Role, role) // Add Role claim dynamically
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new { Token = tokenString });
            }

            return Unauthorized();
        }

        // Example method to fetch user role from database
        private static string GetUserRoleFromDatabase(string username)
        {
            // Replace with your logic to fetch user role from database or any other source
            // For demonstration purposes, returning 'admin' if username is 'test'; otherwise 'user'
            return username == "test" ? "admin" : "user";
        }
    }
}
