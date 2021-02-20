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
    public class TasksToDoController : ControllerBase
    {
        private readonly ToDoProjectContext _context;

        public TasksToDoController(ToDoProjectContext context)
        {
            _context = context;
        }

        private int UserId
        {
            get
            {
                var user = (Users)HttpContext.Items["Users"];
                return user.UserId;
            }
        }
        // GET: api/TasksToDoApi
        [HttpGet("all")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TasksToDo>>> GetTasksToDo()
        {
            return await _context.TasksToDo.Where(
                task => task.UserId == UserId).
                ToListAsync();
        }

        [HttpGet("done")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TasksToDo>>> GetDoneTasksToDo()
        {
            return await _context.TasksToDo.Where(
                task => task.UserId == UserId && task.IsDone == true).
                ToListAsync();
        }

        [HttpGet("notDone")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TasksToDo>>> GetNotDoneTasksToDo()
        {
            return await _context.TasksToDo.Where(
                task => task.UserId == UserId && task.IsDone == false).
                ToListAsync();
        }

        // POST: api/TasksToDoApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TasksToDo>> PostTasksToDo(TasksToDo tasksToDo)
        {
            if (tasksToDo.UserId != UserId)
                return Unauthorized("You cannot create task which are not assigned to you");

            _context.TasksToDo.Add(tasksToDo);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetTasksToDo", new { id = tasksToDo.TaskId }, tasksToDo);
        }


        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutTask(int id, TasksToDo task)
        {
            if (id != task.TaskId)
            {
                return BadRequest();
            }

            if (task.UserId != UserId)
                return Unauthorized("You cannot update task which are not assigned to you");

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TasksToDoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/TasksToDoApi/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTasksToDo(int id)
        {
            var tasksToDo = await _context.TasksToDo.FindAsync(id);
            if (tasksToDo.UserId != UserId)
                return Unauthorized("You cannot delete task which are not assigned to you");
            if (tasksToDo == null)
            {
                return NotFound();
            }
            _context.TasksToDo.Remove(tasksToDo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TasksToDoExists(int id)
        {
            return _context.TasksToDo.Any(e => e.TaskId == id);
        }
    }
}
