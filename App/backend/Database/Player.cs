
namespace App.Database
{
    public class Player
    {
        // Player-entiteten representerar en spelare i vår databas. 
        // Inkluderar spelarens Id, GameId (för att koppla till ett Game), namn och poäng.
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public Guid GameId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Score { get; set; }
    }
}
