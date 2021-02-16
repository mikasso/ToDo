using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoProject.Data;
using ToDoProject.Models;

namespace ToDoProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ToDoProjectContext _context;

        public UsersController(ToDoProjectContext context)
        {
            _context = context;
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Users>> RegisterUser(Users user)
        {
            var alreadyExists = _context.Users.Where(
                (u) => u.Login == user.Login ).FirstOrDefault() != null;
            if (alreadyExists)
                return Conflict("Account with this login already exists.");
            alreadyExists = _context.Users.Where(
                (u) => u.Email == user.Email).FirstOrDefault() != null;
            if (alreadyExists)
                return Conflict("Account with this email already exists.");
            // Create new user 
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }
       
        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }


    }
}
