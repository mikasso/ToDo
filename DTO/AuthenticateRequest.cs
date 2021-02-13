using System.ComponentModel.DataAnnotations;

namespace ToDoProject.Services
{
    public class AuthenticateRequest
    {
        [Required]
        public string login { get; set; }
        [Required]
        public string password { get; set; }

    }

}