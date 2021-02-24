import { Component, Inject } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tasks-filter',
  templateUrl: './tasks-filter.component.html',
  styleUrls: ['./tasks-filter.component.css'],
})

export class TasksFilterComponent {

  @Output() tasksFilterEvent = new EventEmitter<string>();

  selectFilter(filtrOption: string) {
    this.tasksFilterEvent.emit(filtrOption);
  }

}


