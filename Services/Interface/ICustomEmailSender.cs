using Microsoft.AspNetCore.Identity.UI.Services;

namespace ReactShop.Services.Interface
{
    public interface ICustomEmailSender : IEmailSender
    {
        Task SendOrderConfirmationEmailAsync(string email, string fullname, string orderDetails);
    }
}
