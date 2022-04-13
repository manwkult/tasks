import { Component, OnInit } from '@angular/core';

import { Employee } from 'src/app/models/Employee';
import { Task } from 'src/app/models/Task';
import { EmployeesService } from 'src/app/services/employees/employees.service';
import { TaskService } from 'src/app/services/tasks/task.service';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  todo: Task[] = [];
  done: Task[] = [];

  task: Task = new Task();
  tasks: Task[] = [];
  employees: Employee[] = [];

  constructor(public dialog: MatDialog,
    private employeesService: EmployeesService,
    private tasksService: TaskService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.task = new Task();
    this.tasks = [];
    this.employees = [];

    this.tasksService.getAll().subscribe(
      response => {
        if (response && response.success) {
          this.tasks = response.data as Task[];

          this.todo = this.tasks.filter(task => task.status === 0);
          this.done = this.tasks.filter(task => task.status === 1);
        }
      }, error => {
        console.log(error);
      }
    );

    this.employeesService.getAll().subscribe(
      response => {
        if (response && response.success) {
          this.employees = response.data as Employee[];
        }
      }, error => {
        console.log(error);
      }
    );
  }

  saveOrUpdate(task: Task) {
    if (task.id) {
      this.tasksService.update(task).subscribe(
        response => {
          if (response && response.success) {
            this.load();
          }
        }, error => {
          console.log(error);
        }
      );
    } else {
      this.tasksService.save(task).subscribe(
        response => {
          if (response && response.success) {
            this.load();
          }
        }, error => {
          console.log(error);
        }
      );
    }
  }

  updateStatus(id: number | undefined, status: number) {
    if (id) {
      this.tasksService.updateStatus(id, status).subscribe(
        response => {
          if (response && response.success) {
            this.load();
          }
        }, error => {
          console.log(error);
        }
      );
    }
  }

  remove(id: number | undefined) {
    if (id) {
      this.tasksService.delete(id).subscribe(
        response => {
          if (response && response.success) {
            this.load();
          }
        }, error => {
          console.log(error);
        }
      );
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      event.container.data.forEach(task => {
        this.updateStatus(task.id, (event.container.id === 'cdk-drop-list-1' ? 1 : 0));
      });
    }
  }

  openDialog(task: Task): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { ...task }
    });

    dialogRef.afterClosed().subscribe((task: Task) => {
      if (task) {
        task.status = task.status ? task.status : 0;
        this.saveOrUpdate(task);
      }
    });
  }

  calculateDiff(date: Date | undefined): number {
    if (date) {
      let currentDate = new Date();
      date = new Date(date);

      const diff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) / (1000 * 60 * 60 * 24));

      return diff < 0 ? 0 : diff;
    }

    return 0;
  }

}
