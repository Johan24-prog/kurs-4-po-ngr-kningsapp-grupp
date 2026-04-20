using Microsoft.EntityFrameworkCore;

namespace App.Database
{
    // AppDbContext är vår Entity Framework-databascontext.
    // Hanterar anslutningen till databasen och definierar våra DbSet-egenskaper för Game och Player.
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // DbSet-egenskaper för Game och Player, vilket gör att vi kan utföra CRUD-operationer på dessa entiteter via Entity Framework.
        public DbSet<Game> Games => Set<Game>();
        public DbSet<Player> Players => Set<Player>();

        // Konfigurera relationen mellan Game och Player så att när ett Game tas bort, tas även dess Players bort (Cascade Delete).
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Game>()
                .HasMany(g => g.Players)
                .WithOne()
                .HasForeignKey(p => p.GameId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
