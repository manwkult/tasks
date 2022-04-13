import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { ResponseAPI } from '../../models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private behavioSubject = new BehaviorSubject(new Object());

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseAPI> {
    return this.http.get<ResponseAPI>('/employees').pipe(
      map(response => {
        this.behavioSubject.next(response);
        return response as ResponseAPI;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  errorHandler = (error: HttpErrorResponse) => {
    return throwError(error.message || "Server Error");
  }
}
