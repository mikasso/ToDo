import { Component, Inject } from '@angular/core';
import { TasksToDo } from './../models/TasksToDo';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../login-services';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Component({
  selector: 'tasks-to-do-data',
  templateUrl: './tasks-to-do.component.html',
  styleUrls: ['./tasks-to-do.component.css']
})

export class TasksToDoComponent {
  public tasks: TasksToDo[];
  newTaskName: string;
  newTaskDescription: string;
  newTaskIsDone: boolean;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private router: Router,
    private authService: AuthenticationService
   ) {
    // if user is not logged in then redirect to login page
    if (!this.authService.isLogged) {
      this.router.navigate(['/login']);
    }
    this.getTasks();
  }

  getTasks(parameter: string = "all") {
    this.http.get<any>(this.getTasksApiURL() + parameter).subscribe(
      result => this.tasks = result);
  }

  toggleDone(task: TasksToDo) {
    var url = this.getTasksApiURL() + task.taskId.toString();
    this.http.put<any>(url, JSON.stringify(task), httpOptions).subscribe(
      result => task.isDone = !task.isDone
    );
  }

  addNewTask() {
    var taskToSend = {
      name: this.newTaskName,
      description: this.newTaskDescription,
      isDone: this.newTaskIsDone,
      userid: this.authService.currentUserValue.id,
    };
    this.http.post(this.getTasksApiURL(), taskToSend, httpOptions).toPromise().then((task: TasksToDo) => {
      this.tasks.push(task);
      this.resetInputVars();
    });
  }

  deleteTask(index: number) {
    var url = this.getTasksApiURL() + this.tasks[index].taskId.toString();
    this.http.delete(url).subscribe(
      () => { this.tasks.splice(index, 1); },
    );
  }

  getTasksApiURL(): string {
    return `${this.baseUrl}api/TasksToDo/`;
  }

  resetInputVars() {
    this.newTaskName = this.newTaskDescription = "";
    this.newTaskIsDone = false;
  }
}


