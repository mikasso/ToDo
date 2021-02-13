using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoProject.Models;

namespace ToDoProject.DTO
{
    public class AuthenticateResponse
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }


        public AuthenticateResponse(Users user, string token)
        {
            Id = user.UserId;
            Login = user.Login;
            Name = user.Name;
            Email = user.Email;
            Token = token;
        }
    }
}

