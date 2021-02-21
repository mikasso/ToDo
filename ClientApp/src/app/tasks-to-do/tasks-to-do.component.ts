import { Component, Inject } from '@angular/core';
import { TasksToDo } from './../models/TasksToDo';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  private taskURL: string;
  newTaskName: string;
  newTaskDescription: string;
  newTaskIsDone: boolean;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private router: Router,
    private authService: AuthenticationService) {
    // if user is not logged in then redirect to login page
    if (!this.authService.isLogged) {
      this.router.navigate(['/login']);
    }
    this.getTasks();
  }

  getTasks(parameter: string = "all") {
    console.log("get tasks()")
    var req = this.http.get<any>(this.getTasksApiURL() + parameter).subscribe(
      result => this.tasks = result,
      error => this.handleError(error));
  }

  handleError(error: HttpErrorResponse): void {
    if (error.status == 401) {
      this.authService.logout();

      this.router.navigate(['/login']);
    }
  }

  toggleDone(task: TasksToDo) {
    task.isDone = !task.isDone;
    var url = this.getTasksApiURL() + task.taskId.toString();
    this.http.put(url, JSON.stringify(task), httpOptions).subscribe(
      () => { },
      err => console.log(err)
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
      err => console.log(err)
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


