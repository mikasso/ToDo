import { Component, Inject } from '@angular/core';
import { TasksToDo } from './../models/TasksToDo';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl } from '../../main';
import { HttpHeaders } from '@angular/common/http';
import { Local } from 'protractor/built/driverProviders';
import { Router } from '@angular/router';
import { AuthenticationService } from '../login-services';
import { AuthInterceptor } from '../login-services/authintercept.service';
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
    @Inject('BASE_URL') baseUrl: string,
    private router: Router,
    private authService: AuthenticationService) {
    // if user is not logged in then redirect to login page
    if (!this.authService.isLogged) {
      this.router.navigate(['/login']);
    }
    // otherwise get users tasks
    var req = this.http.get<any>(this.getTasksApiURL()).subscribe(
      result => this.tasks = result,
      error => console.error(error)); 
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
    return `${getBaseUrl()}api/TasksToDo/`;
  }

  resetInputVars() {
    this.newTaskName = this.newTaskDescription = "";
    this.newTaskIsDone = false;
  }




}


