import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Task } from 'src/app/models/Task';
import { ResponseAPI } from '../../models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private behavioSubject = new BehaviorSubject(new Object());

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResponseAPI> {
    return this.http.get<ResponseAPI>('/tasks').pipe(
      map(response => {
        this.behavioSubject.next(response);
        return response as ResponseAPI;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  getById(id: number): Observable<ResponseAPI> {
    return this.http.get<ResponseAPI>(`/tasks/${id}`).pipe(
      map(response => {
        this.behavioSubject.next(response);
        return response as ResponseAPI;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  save(task: Task): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>('/tasks', task).pipe(
      map(response => {
        this.behavioSubject.next(response);
        return response as ResponseAPI;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  update(task: Task): Observable<ResponseAPI> {
    return this.http.put<ResponseAPI>('/tasks', task).pipe(
      map(response => {
        this.behavioSubject.next(response);
        return response as ResponseAPI;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  updateStatus(id: number, status: number): Observable<ResponseAPI> {
    return this.http.patch<ResponseAPI>(`/tasks/${id}/${status}`, {}).pipe(
      map(response => {
        this.behavioSubject.next(response);
        return response as ResponseAPI;
      })
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  delete(id: number): Observable<ResponseAPI> {
    return this.http.delete<ResponseAPI>(`/tasks/${id}`).pipe(
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
