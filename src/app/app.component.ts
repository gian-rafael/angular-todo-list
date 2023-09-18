import { Component, OnInit } from "@angular/core";
import { TodoService } from "./todo.service";
import { Todo } from "./models/todo";
import { Observable, BehaviorSubject, of } from "rxjs";
import { take } from "rxjs/operators";
import { AddTodoService } from "./add-todo.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  todos$: Observable<Todo[]> = new BehaviorSubject([]);
  showAddTodo$: Observable<boolean> = of(false);

  constructor(
    private todoService: TodoService,
    private addTodoService: AddTodoService
  ) {}

  ngOnInit() {
    this.getTodos();
    this.showAddTodo$ = this.addTodoService.isOpen;
  }

  getTodos() {
    this.todos$ = this.todoService.getTodos();
  }

  addTodo() {
    this.todoService
      .addTodo({ status: "pending", task: "do laundry" })
      .subscribe();
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
