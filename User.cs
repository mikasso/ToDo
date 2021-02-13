using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace ToDoProject.Models
{
    [Table("Users")]
    public partial class User
    {
        public User()
        {
            TasksToDos = new HashSet<TasksToDo>();
        }
        [Key]
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Login { get; set; }

        public virtual ICollection<TasksToDo> TasksToDos { get; set; }
    }
}
