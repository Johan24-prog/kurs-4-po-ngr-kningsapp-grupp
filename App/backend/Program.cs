using App;
using App.Database;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=scoreboard.db"));

builder.Services.AddSignalR();
//this was needed to connect to SignalR from "a different origin"
//which i assume is because i was testing it with a seperate html file
//Try removing CORS later when SignalR is implemented in frontend to see if it still works
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true);
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Serve React build output from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors();

// --- Minimal API endpoints ---
app.MapHub<GameHub>("/gamehub");

app.MapGet("/api/games", async (AppDbContext db) =>
{
    var games = await db.Games
        .AsNoTracking()
        .Include(g => g.Players)
        .ToListAsync();

    return Results.Ok(games.Select(ToGameResponse));
});

// Hämta ett specifikt spel med dess spelare. Returnerar 404 om spelet inte finns.
app.MapGet("/api/games/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var game = await db.Games
        .AsNoTracking()
        .Include(g => g.Players)
        .FirstOrDefaultAsync(g => g.Id == id);

    return game is not null ? Results.Ok(ToGameResponse(game)) : Results.NotFound();
});

// Skapa ett nytt spel. Returnerar 409 om spelet redan finns.
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

// Uppdatera ett spel. Om spelet inte finns skapas det.
app.MapPut("/api/games/{id:guid}", async (Guid id, CreateOrUpdateGameDto dto, AppDbContext db, IHubContext<GameHub> hubContext) =>
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

    var incomingPlayers = dto.Players ?? new List<CreateOrUpdatePlayerDto>();
    var incomingPlayerIds = new HashSet<string>();

    foreach (var incoming in incomingPlayers)
    {
        var incomingId = string.IsNullOrWhiteSpace(incoming.Id)
            ? Guid.NewGuid().ToString()
            : incoming.Id;

        incomingPlayerIds.Add(incomingId);

        var existingPlayer = existing.Players.FirstOrDefault(p => p.Id == incomingId);
        if (existingPlayer is null)
        {
            existing.Players.Add(new Player
            {
                Id = incomingId,
                GameId = existing.Id,
                Name = incoming.Name,
                Score = incoming.Score,
                InitialScore = incoming.InitialScore,
            });

            continue;
        }

        existingPlayer.Name = incoming.Name;
        existingPlayer.Score = incoming.Score;
        // InitialScore bibehålls från innan om det inte ändrats
    }

    var playersToRemove = existing.Players
        .Where(player => !incomingPlayerIds.Contains(player.Id))
        .ToList();

    foreach (var playerToRemove in playersToRemove)
    {
        db.Players.Remove(playerToRemove);
    }

    await hubContext.Clients
        .Group($"game-{id}")
        .SendAsync("GameUpdated");

    await db.SaveChangesAsync();
    return Results.Ok(ToGameResponse(existing));
});

// Tar bort ett spel och dess spelare.
app.MapDelete("/api/games/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var existing = await db.Games
        .Include(g => g.Players)
        .FirstOrDefaultAsync(g => g.Id == id);

    if (existing is null)
    {
        return Results.NotFound();
    }

    db.Games.Remove(existing);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Fallback: let React Router handle client-side routes
app.MapFallbackToFile("index.html");

app.Run();

// --- Mapping functions ---
// Mappar en CreateOrUpdateGameDto till en Game-entitet, inklusive dess spelare
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
            InitialScore = p.InitialScore,
        }).ToList() ?? new List<Player>()
    };
}

// Mappar en Game-entitet till en GameResponseDto, inklusive dess spelare.
static GameResponseDto ToGameResponse(Game game)
{
    return new GameResponseDto(
        game.Id,
        game.Name,
        game.HigherIsBetter,
        game.AllowAddingPlayers,
        game.Players.Select(p => new PlayerResponseDto(p.Id, p.Name, p.Score, p.InitialScore)).ToList()
    );
}

// --- DTO records ---
// DTOs (Data Transfer Objects) används för att definiera strukturen på data som skickas till och från API:et.
public record CreateOrUpdateGameDto(
    Guid Id,
    string GameName,
    bool HigherIsBetter,
    bool AllowAddingPlayers,
    List<CreateOrUpdatePlayerDto>? Players
);

// DTO för att skapa eller uppdatera en spelare. Inkluderar Id (för uppdatering), namn, aktuell poäng och startpoäng.
public record CreateOrUpdatePlayerDto(
    string Id,
    string Name,
    int Score,
    int InitialScore
);

// DTO för att representera ett spel i API-responsen. Inkluderar spelets Id, namn, regler och en lista över spelare.
public record GameResponseDto(
    Guid Id,
    string GameName,
    bool HigherIsBetter,
    bool AllowAddingPlayers,
    List<PlayerResponseDto> Players
);

// DTO för att representera en spelare i API-responsen. Inkluderar spelarens Id, namn, aktuell poäng och startpoäng.
public record PlayerResponseDto(
    string Id,
    string Name,
    int Score,
    int InitialScore
);