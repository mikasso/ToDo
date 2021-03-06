﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace ToDoProject.Models
{
    public partial class TasksToDo
    {
        [Key]
        public int TaskId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsDone { get; set; }
        public int UserId { get; set; }

        public virtual Users User { get; set; }
    }
}
