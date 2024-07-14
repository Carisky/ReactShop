namespace ReactShop.Services
{
    using ReactShop.Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using System.Security.Cryptography;
    using System.Text;

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> Create(User user)
        {
            user.Password = HashPassword(user.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> Update(User user)
        {
            var existingUser = await _context.Users.FindAsync(user.Id);
            if (existingUser == null) return null;

            existingUser.Login = user.Login;
            existingUser.Role = user.Role;

            // Update password if it's changed
            if (!string.IsNullOrEmpty(user.Password))
            {
                existingUser.Password = HashPassword(user.Password);
            }

            _context.Users.Update(existingUser);
            await _context.SaveChangesAsync();
            return existingUser;
        }

        public async Task<bool> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
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
