import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { TaskModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  base_path = 'http://localhost:3000/tasksData'

  momentjs:any = moment;
  
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  createTask(task: TaskModel): Observable<TaskModel> {
    var newTask = {
      id: "",
      level: task.level,
      grade: task.grade,
      module: task.module,
      name: task.name,
      type: task.type,
      info: task.info,
      date: task.date
    }
    return this.http
      .post<TaskModel>(this.base_path, JSON.stringify(newTask), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getTask(id: string): Observable<TaskModel> {
    return this.http
      .get<TaskModel>(this.base_path + '/' + id)
      .pipe(
        catchError(this.handleError)
      )
  }

  getListTask(): Observable<TaskModel> {
    return this.http
      .get<TaskModel>(this.base_path + '/')
      .pipe(
        catchError(this.handleError)
      )
  }

  updateTask(id: string | undefined, task: TaskModel): Observable<TaskModel> {
    return this.http
      .put<TaskModel>(this.base_path + '/' + id, JSON.stringify(task), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteTask(id: string) {
    return this.http
      .delete<TaskModel>(this.base_path + '/' + id, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
}