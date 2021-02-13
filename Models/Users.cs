using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace ToDoProject.Models
{
    public partial class Users
    {
        public Users()
        {
            TasksToDos = new HashSet<TasksToDo>();
        }

        [Key]
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public virtual ICollection<TasksToDo> TasksToDos { get; set; }
    }
}
