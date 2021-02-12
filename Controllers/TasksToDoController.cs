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

        // GET: api/TasksToDoApi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TasksToDo>>> GetTasksToDo()
        {
            return await _context.TasksToDo.ToListAsync();
        }

        // GET: api/TasksToDoApi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TasksToDo>> GetTasksToDo(int id)
        {
            var tasksToDo = await _context.TasksToDo.FindAsync(id);

            if (tasksToDo == null)
            {
                return NotFound();
            }

            return tasksToDo;
        }

        // PUT: api/TasksToDoApi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTasksToDo(int id, TasksToDo tasksToDo)
        {
            if (id != tasksToDo.TaskId)
            {
                return BadRequest();
            }

            _context.Entry(tasksToDo).State = EntityState.Modified;

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

        // POST: api/TasksToDoApi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TasksToDo>> PostTasksToDo(TasksToDo tasksToDo)
        {
            _context.TasksToDo.Add(tasksToDo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTasksToDo", new { id = tasksToDo.TaskId }, tasksToDo);
        }

        // DELETE: api/TasksToDoApi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTasksToDo(int id)
        {
            var tasksToDo = await _context.TasksToDo.FindAsync(id);
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
