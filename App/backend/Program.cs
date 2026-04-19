using App.Database;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Serve React build output from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// --- Minimal API endpoints ---
app.MapGet("/api/games/{id:guid}", (Guid id) =>
{
    var g = Database.GetGame(id);
    return g is not null ? Results.Ok(g) : Results.NotFound();
});

app.MapPost("/api/games", (CreateGameDto dto) =>
{
    var game = new Game
    {
        Id = dto.id,
        Name = dto.GameName,
        HigherIsBetter = dto.HigherIsBetter,
        LockedPlayers = dto.LockedPlayers,
        Players = dto.Players?.Select(p => new Player
        {
            Name = p.Name,
            Score = p.Score
        }).ToList() ?? new List<Player>()
    };
    Database.AddGame(game);
    Console.WriteLine("Created game: " + game.Id);
    return Results.Created("/api/games&/" + game.Id.ToString(), game);
});

// Fallback: let React Router handle client-side routes
app.MapFallbackToFile("index.html");

app.Run();


public record CreateGameDto(
    Guid id,
    string GameName,
    bool HigherIsBetter,
    bool LockedPlayers,
    List<CreatePlayerDto>? Players
);

public record CreatePlayerDto(
    string Name,
    int Score
);