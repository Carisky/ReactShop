namespace ReactShop.Models
{
    public class Order
    {
        public int Id { get; set; }
        public required string Address { get; set; }
        public required string Fullname { get; set; }
        public required PaymentInfo PaymentInfo { get; set; }
    }
}
