using App.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=scoreboard.db"));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Serve React build output from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// --- Minimal API endpoints ---
app.MapGet("/api/games", async (AppDbContext db) =>
{
    var games = await db.Games
        .AsNoTracking()
        .Include(g => g.Players)
        .ToListAsync();

    return Results.Ok(games.Select(ToGameResponse));
});

app.MapGet("/api/games/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var game = await db.Games
        .AsNoTracking()
        .Include(g => g.Players)
        .FirstOrDefaultAsync(g => g.Id == id);

    return game is not null ? Results.Ok(ToGameResponse(game)) : Results.NotFound();
});

app.MapPost("/api/games", async (CreateOrUpdateGameDto dto, AppDbContext db) =>
{
    var exists = await db.Games.AnyAsync(g => g.Id == dto.Id);
    if (exists)
    {
        return Results.Conflict(new { message = "Game already exists" });
    }

    var game = ToGameEntity(dto);
    db.Games.Add(game);
    await db.SaveChangesAsync();

    return Results.Created("/api/games/" + game.Id.ToString(), ToGameResponse(game));
});

app.MapPut("/api/games/{id:guid}", async (Guid id, CreateOrUpdateGameDto dto, AppDbContext db) =>
{
    var existing = await db.Games
        .Include(g => g.Players)
        .FirstOrDefaultAsync(g => g.Id == id);

    if (existing is null)
    {
        var created = ToGameEntity(dto with { Id = id });
        db.Games.Add(created);
        await db.SaveChangesAsync();
        return Results.Created("/api/games/" + created.Id.ToString(), ToGameResponse(created));
    }

    existing.Name = dto.GameName;
    existing.HigherIsBetter = dto.HigherIsBetter;
    existing.AllowAddingPlayers = dto.AllowAddingPlayers;
    existing.Players = dto.Players?.Select(p => new Player
    {
        Id = string.IsNullOrWhiteSpace(p.Id) ? Guid.NewGuid().ToString() : p.Id,
        GameId = existing.Id,
        Name = p.Name,
        Score = p.Score,
    }).ToList() ?? new List<Player>();

    await db.SaveChangesAsync();
    return Results.Ok(ToGameResponse(existing));
});

// Fallback: let React Router handle client-side routes
app.MapFallbackToFile("index.html");

app.Run();


static Game ToGameEntity(CreateOrUpdateGameDto dto)
{
    return new Game
    {
        Id = dto.Id,
        Name = dto.GameName,
        HigherIsBetter = dto.HigherIsBetter,
        AllowAddingPlayers = dto.AllowAddingPlayers,
        Players = dto.Players?.Select(p => new Player
        {
            Id = string.IsNullOrWhiteSpace(p.Id) ? Guid.NewGuid().ToString() : p.Id,
            GameId = dto.Id,
            Name = p.Name,
            Score = p.Score,
        }).ToList() ?? new List<Player>()
    };
}

static GameResponseDto ToGameResponse(Game game)
{
    return new GameResponseDto(
        game.Id,
        game.Name,
        game.HigherIsBetter,
        game.AllowAddingPlayers,
        game.Players.Select(p => new PlayerResponseDto(p.Id, p.Name, p.Score)).ToList()
    );
}

public record CreateOrUpdateGameDto(
    Guid Id,
    string GameName,
    bool HigherIsBetter,
    bool AllowAddingPlayers,
    List<CreateOrUpdatePlayerDto>? Players
);

public record CreateOrUpdatePlayerDto(
    string Id,
    string Name,
    int Score
);

public record GameResponseDto(
    Guid Id,
    string GameName,
    bool HigherIsBetter,
    bool AllowAddingPlayers,
    List<PlayerResponseDto> Players
);

public record PlayerResponseDto(
    string Id,
    string Name,
    int Score
);