import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from 'src/app/models/Employee';
import { Task } from 'src/app/models/Task';
import { EmployeesService } from 'src/app/services/employees/employees.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  employees: Employee[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private employeesService: EmployeesService) { }

  ngOnInit(): void {
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeEmployee(employeeId: number) {
    this.data.employeeId = employeeId;
  }
}
