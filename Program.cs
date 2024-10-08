using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using ReactShop.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


ServiceLoader.ConfigureServices(builder.Services, builder.Configuration);


builder.Logging.ClearProviders();
builder.Logging.AddConsole();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("https://localhost:44490")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        dbContext.Database.CanConnect();
        logger.LogInformation("Connection successful.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Connection failed: {Message}", ex.Message);
    }
}


if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.UseCors("AllowReactApp");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
