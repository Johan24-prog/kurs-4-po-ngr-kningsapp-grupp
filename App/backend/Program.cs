var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Serve React build output from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// --- Minimal API endpoints ---
app.MapGet("/api/hello", () => Results.Ok(new { message = "Hello from ASP.NET Core Minimal API!" }));

// Fallback: let React Router handle client-side routes
app.MapFallbackToFile("index.html");

app.Run();
