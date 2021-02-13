using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using ToDoProject.Data;
using ToDoProject.DTO;
using ToDoProject.Models;

namespace ToDoProject.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model);
        IEnumerable<Users> GetAll();
        Users GetById(int id);
    }

    public class UserService : IUserService
    {

        private readonly AppSettings _appSettings;

        public ToDoProjectContext _context { get; }

        public UserService(IOptions<AppSettings> appSettings, ToDoProjectContext _context)
        {
            _appSettings = appSettings.Value;
            this._context = _context;
        }



        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            var user = _context.Users.SingleOrDefault(x => x.Login == model.login && x.Password == model.password);

            // return null if user not found
            if (user == null) return null;

            // authentication successful so generate jwt token
            var token = generateJwtToken(user);

            return new AuthenticateResponse(user, token);
        }

        IEnumerable<Users> IUserService.GetAll()
        {
            return _context.Users;
        }

        Users IUserService.GetById(int id)
        {
            return _context.Users.FirstOrDefault(x => x.UserId == id);
        }


        // helper methods

        private string generateJwtToken(Users user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.UserId.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}