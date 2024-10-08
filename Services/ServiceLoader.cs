using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactShop.Services.Impl;
using ReactShop.Services.Interface;
using System.Text;

namespace ReactShop.Services
{
    public static class ServiceLoader
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {

            services.AddControllersWithViews();


            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));


            services.AddCors(options =>
            {
                options.AddPolicy("ReactPolicy",
                    builder =>
                    {
                        builder.WithOrigins("https://localhost:44490")
                               .AllowAnyHeader()
                               .AllowAnyMethod();
                    });
            });


            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddSingleton<ICustomEmailSender, EmailService>(sp =>
            new EmailService(
                configuration["Email:SmtpServer"],
                int.Parse(configuration["Email:SmtpPort"]),
                configuration["Email:SmtpUser"],
                configuration["Email:SmtpPass"]
            ));
            var key = Encoding.ASCII.GetBytes("my-32-character-ultra-secure-and-ultra-long-secret");
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });


            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
                options.AddPolicy("AuthorizedUserOnly", policy => policy.RequireRole("User"));
            });
        }
    }
}
