using Microsoft.AspNetCore.SignalR;
namespace App
{
    public class GameHub : Hub
    {
        public async Task JoinGame(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"game-{gameId}");
        }

        public async Task LeaveGame(string gameId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"game-{gameId}");
        }
    }
}
