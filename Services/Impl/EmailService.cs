using MimeKit;
using MailKit.Net.Smtp;
using ReactShop.Services.Interface;

namespace ReactShop.Services
{
    public class EmailService : ICustomEmailSender
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUser;
        private readonly string _smtpPass;

        public EmailService(string smtpServer, int smtpPort, string smtpUser, string smtpPass)
        {
            _smtpServer = smtpServer;
            _smtpPort = smtpPort;
            _smtpUser = smtpUser;
            _smtpPass = smtpPass;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("React Shop", _smtpUser));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("html") { Text = htmlMessage };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_smtpServer, _smtpPort, false);
                await client.AuthenticateAsync(_smtpUser, _smtpPass);
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
        }

        private static string LoadEmailTemplate(string templatePath)
        {
            return File.ReadAllText(templatePath);
        }

        private static string PopulateEmailTemplate(string template, string fullname, string orderDetails)
        {
            return template.Replace("{Fullname}", fullname)
                           .Replace("{OrderDetails}", orderDetails);
        }

        public async Task SendOrderConfirmationEmailAsync(string email, string fullname, string orderDetails)
        {
            var templatePath = "Templates/OrderConfirmationTemplate.html";
            var template = LoadEmailTemplate(templatePath);
            var htmlMessage = PopulateEmailTemplate(template, fullname, orderDetails);

            await SendEmailAsync(email, "Order Confirmation", htmlMessage);
        }
    }

}
