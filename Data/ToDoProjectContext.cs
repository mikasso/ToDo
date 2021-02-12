using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ToDoProject.Models;

namespace ToDoProject.Data
{
    public class ToDoProjectContext : DbContext
    {
        public ToDoProjectContext (DbContextOptions<ToDoProjectContext> options)
            : base(options)
        {
        }

        public DbSet<ToDoProject.Models.TasksToDo> TasksToDo { get; set; }
    }
}
