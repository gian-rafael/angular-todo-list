import { Component, Input, Output, EventEmitter } from "@angular/core";

import { Todo } from "../../models/todo";

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
})
export class TodoListComponent {
  @Input() todos: Todo[];

  @Output() edit = new EventEmitter<Todo>();
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();

  constructor() {}

  onEdit(todo: Todo) {
    this.edit.emit(todo);
  }

  onToggle(todo: Todo) {
    this.toggle.emit(todo);
  }

  onDelete(todo: Todo) {
    this.delete.emit(todo);
  }
}
