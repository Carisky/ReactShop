namespace ReactShop.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Amount { get; set; }
        public string ?ImageUrl { get; set; }
        public string[] Tags { get; set; }
        
    }
}
