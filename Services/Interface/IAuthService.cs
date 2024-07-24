namespace ReactShop.Services
{
    using System.Threading.Tasks;

    public interface IAuthService
    {
        Task<bool> ValidateUser(string username, string password);
        Task<string> GetUserRole(string username);
    }
}
