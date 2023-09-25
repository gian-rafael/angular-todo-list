import { Component, OnDestroy, OnInit } from "@angular/core";
import { TodoService, TodoServiceError } from "./todo.service";
import { Todo } from "./models/todo";
import { Observable, BehaviorSubject, of, Subscription } from "rxjs";
import { take, bufferTime } from "rxjs/operators";
import { AddTodoService } from "./add-todo.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    //"./app.component.scss"
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  todos$: Observable<Todo[]> = new BehaviorSubject([]);
  showAddTodo$: Observable<boolean> = of(false);
  errors$: Observable<TodoServiceError>;

  errorClear: Subscription;

  errorMessages = {
    add: "An Error has occured while adding todo",
    delete: "An Error has occured while deleting todo.",
    get: "An Error has occured while fetching the data.",
    edit: "An Error has occured while saving.",
  };

  constructor(
    private todoService: TodoService,
    private addTodoService: AddTodoService
  ) {}

  ngOnInit() {
    this.getTodos();
    this.showAddTodo$ = this.addTodoService.isOpen;
    this.errors$ = this.todoService.errors;
    this.errorClear = this.errors$.pipe(bufferTime(7500)).subscribe(() => {
      this.todoService.clearErrors();
    });
  }

  ngOnDestroy() {
    this.errorClear.unsubscribe();
  }

  getTodos() {
    this.todos$ = this.todoService.getTodos();
  }

  toggleAddTodo() {
    this.addTodoService.toggleTodo();
  }

  onAdd(todo: Pick<Todo, "task" | "status">) {
    this.todoService
      .addTodo(todo)
      .pipe(take(1))
      .subscribe(() => this.toggleAddTodo());
  }

  onUpdate(todo: Todo) {
    this.todoService.editTodo(todo).pipe(take(1)).subscribe();
  }

  onDelete(todo: Todo) {
    this.todoService.deleteTodo(todo).pipe(take(1)).subscribe();
  }
}
