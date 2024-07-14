using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ReactShop.Services;
using ReactShop.Services.Interface;
using System.Text;

namespace ReactShop.Services
{
    public static class ServiceLoader
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            // Add controllers with views
            services.AddControllersWithViews();

            // Add PostgreSQL DbContext
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            // Add CORS policy
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

            // Add scoped service
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();

            // JWT Authentication
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

            // Add Authorization
            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            });
        }
    }
}
