namespace ReactShop.Services
{
    using System.Threading.Tasks;
    using ReactShop.Models;
    using Microsoft.EntityFrameworkCore;
    using System.Security.Cryptography;
    using System.Text;

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ValidateUser(string username, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Login == username);
            if (user == null) return false;

            var hashedPassword = HashPassword(password);
            return user.Password == hashedPassword;
        }

        public async Task<string> GetUserRole(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Login == username);
            return user?.Role;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}
