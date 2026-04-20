
namespace App.Database
{
    public class Player
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public Guid GameId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Score { get; set; }
    }
}
