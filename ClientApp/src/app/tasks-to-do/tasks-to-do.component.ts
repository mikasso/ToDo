import { Component, Inject } from '@angular/core';
import { TasksToDo } from './../models/TasksToDo';
import { HttpClient } from '@angular/common/http';
import { getBaseUrl } from '../../main';
import { HttpHeaders } from '@angular/common/http';
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
  private http: HttpClient;
  private taskURL: string;
  newTaskName: string;
  newTaskDescription: string;
  newTaskIsDone: boolean;
  

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.taskURL = baseUrl + 'api/TasksToDo/';
    this.http.get<TasksToDo[]>(this.taskURL).subscribe(result => {
      this.tasks = result;
    }, error => console.error(error));
  }

  public toggleDone(task: TasksToDo) {
    task.isDone = !task.isDone;
    var url = this.taskURL + task.taskId.toString();
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
      userid: 1
    };
    this.http.post(this.taskURL, taskToSend, httpOptions).toPromise().then((task: TasksToDo) => 
    {
      this.tasks.push(task);
      this.resetInputVars();
    });
  }

  private resetInputVars() {
    this.newTaskName = this.newTaskDescription = "";
    this.newTaskIsDone = false;
  }

  deleteTask(index : number) {
    var url = this.taskURL + this.tasks[index].taskId.toString();
    this.http.delete(url).subscribe(
      () => { this.tasks.splice(index, 1); },
      err => console.log(err)
    );
  }

}


