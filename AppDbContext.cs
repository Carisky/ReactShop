using Microsoft.EntityFrameworkCore;
using ReactShop.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    // Define your DbSets here
    // public DbSet<YourEntity> YourEntities { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }

    // Define your Custom rels here
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>()
            .OwnsOne(o => o.PaymentInfo);
    }
}
