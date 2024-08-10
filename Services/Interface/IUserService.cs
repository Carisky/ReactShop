namespace ReactShop.Services.Interface
{
    using ReactShop.Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IUserService
    {
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(int id);
        Task<User> Create(User user);
        Task<User> Update(User user);
        Task<bool> Delete(int id);
    }
}
