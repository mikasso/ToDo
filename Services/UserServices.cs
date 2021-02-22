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

        private readonly AppSettings AppSettings;

        public ToDoProjectContext Context { get; }

        private readonly int TokenLifeTime;

        public UserService(IOptions<AppSettings> appSettings, ToDoProjectContext context)
        {
            AppSettings = appSettings.Value;
            Context = context;
            TokenLifeTime = AppSettings.TokenLifeTime;
        }



        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            var user = Context.Users.SingleOrDefault(x => x.Login == model.login && x.Password == model.password);

            // return null if user not found
            if (user == null) return null;

            // authentication successful so generate jwt token
            var token = GenerateJwtToken(user);

            return new AuthenticateResponse(user, token);
        }

        IEnumerable<Users> IUserService.GetAll()
        {
            return Context.Users;
        }

        Users IUserService.GetById(int id)
        {
            return Context.Users.FirstOrDefault(x => x.UserId == id);
        }


        // helper methods

        private string GenerateJwtToken(Users user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(AppSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.UserId.ToString()) }),
                Expires = DateTime.UtcNow.AddMinutes(TokenLifeTime),                                         
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}