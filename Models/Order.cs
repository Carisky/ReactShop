namespace ReactShop.Models
{

    public class Order
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Fullname { get; set; }
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

}
