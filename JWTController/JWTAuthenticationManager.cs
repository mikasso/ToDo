using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ToDoProject.Data;
using ToDoProject.Models;

namespace ToDoProject.JWTController
{
    public class JWTAuthenticationManager : IJWTAuthenticationManager
    {
        private readonly ToDoProjectContext _context;
        public readonly string key = "SECRETKEY 123456#!@$";
        public JWTAuthenticationManager(ToDoProjectContext ctx)
        {
            _context = ctx;
        }
        public string Authenticate(string login, string password)
        {
            if (verifyUser(login, password) == false)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(key);
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Name, login)
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private bool verifyUser(string login, string password)
        {
            return _context.Users.Where(user => user.Login == login && user.Password == password).Any();
        }
    }
}
