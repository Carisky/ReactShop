using Microsoft.AspNetCore.Authorization;
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
            
            if (userLogin.Username == "test" && userLogin.Password == "password")
            {
                
                string role = GetUserRoleFromDatabase(userLogin.Username);

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("my-32-character-ultra-secure-and-ultra-long-secret");
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, userLogin.Username),
                        new Claim(ClaimTypes.Role, role) 
                    }),
                    Expires = DateTime.UtcNow.AddSeconds(10),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new { Token = tokenString });
            }

            return Unauthorized();
        }

        
        private static string GetUserRoleFromDatabase(string username)
        {
            
            
            return username == "test" ? "admin" : "user";
        }
    }
}
