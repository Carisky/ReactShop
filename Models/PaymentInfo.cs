namespace ReactShop.Models
{
    public class PaymentInfo
    {
        public required string Fullname { get; set; }
        public required int Cvv { get; set; }
        public required string CardNumber { get; set; }

    }
}
