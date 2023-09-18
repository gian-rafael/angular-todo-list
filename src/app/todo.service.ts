import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Todo } from "./models/todo";

import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, switchMap, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  readonly TODO_API = "http://localhost:3000/todos/";

  private changes = new BehaviorSubject(null);

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[] | never> {
    return this.changes.pipe(
      switchMap(() => this.http.get<Todo[]>(this.TODO_API)),
      catchError((error) => throwError(error))
    );
    // return this.http.get<Todo[]>(this.TODO_API);
  }

  addTodo(todo: Pick<Todo, "task" | "status">): Observable<Todo> {
    return this.http.post<Todo>(this.TODO_API, todo).pipe(
      tap(() => this.changes.next(null)),
      catchError((error) => throwError(error))
    );
  }

  deleteTodo(todo: Todo) {
    return this.http.delete(`${this.TODO_API}${todo.id}`).pipe(
      tap(() => this.changes.next(null)),
      catchError((error) => throwError(error))
    );
  }

  editTodo(todo: Todo) {
    return this.http.put(`${this.TODO_API}${todo.id}`, todo).pipe(
      tap(() => this.changes.next(null)),
      catchError((error) => throwError(error))
    );
  }
}
