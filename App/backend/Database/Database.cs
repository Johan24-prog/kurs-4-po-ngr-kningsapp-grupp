namespace App.Database
{
    public static class Database
    {
        private static Dictionary<Guid, Game> games = new Dictionary<Guid, Game>();

        public static void AddGame(Game game)
        {
            games[game.Id] = game;
        }

        public static Game? GetGame(Guid id)
        {
            games.TryGetValue(id, out var game);
            return game;
        }
    }
}
