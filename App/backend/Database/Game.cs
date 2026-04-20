namespace App.Database
{
    public class Game
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public bool HigherIsBetter { get; set; } = true;
        public bool AllowAddingPlayers { get; set; } = true;
        public List<Player> Players { get; set; } = new List<Player>();

    }
}
