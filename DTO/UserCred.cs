using System.ComponentModel.DataAnnotations;

namespace ToDoProject.Controllers
{
    public class UserCred
    {
        [Required]
        public string login { get; set; }
        [Required]
        public string password { get; set; }
    }
}