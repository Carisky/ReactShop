using System.ComponentModel.DataAnnotations;
namespace ReactShop.Models

{

    public class Review
    {
        public int Id { get; set; }
        public int UserId{ get; set; }
        public int ProductId{ get; set; }
        public string ReviewPlot{ get; set; } = "";
        
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating{ get; set;}
    }

}
