namespace ReactShop.Models
{

public class OrderCreateDto
    {
        public string Fullname { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public List<CartItem> Items { get; set; }
    }
}
