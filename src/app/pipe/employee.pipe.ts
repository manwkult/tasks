import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../models/Employee';

@Pipe({
  name: 'employee'
})
export class EmployeePipe implements PipeTransform {

  transform(value: Employee[], ...args: any[]): string {
    return value.map((item: any) => {
      if (item.id === args[0]) {
        return item.name;
      }
    })[0];
  }

}
